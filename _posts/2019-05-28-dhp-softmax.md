---
layout: post
title: ICML AMTL 2019 - Differentiable Hebbian Plasticity for Continual Learning 
description: "Gradient optimized Hebbian plasticity to help mitigate catastrophic forgetting."
comments: true
---

<i>Note: To learn more about continual learning, check out my blog post: </i> <a href="https://vithursant.com/continual-learning-overview/" target="_blank">Continual Lifelong Learning with Deep Neural Nets</a>.

<br />
Deep neural networks (DNNs) are prone to "forgetting" past knowledge, which has
been coined in the literature as <i>catastrophic forgetting</i> or
<i>catastrophic interference</i> [2, 4]. This limits the DNN's ability to
perform continual lifelong learning as they face the "stability-plasticity"
dilemma when retaining memories. Stability refers to the preserving of existing
knowledge while, plasticity refers to integrating new knowledge. 

<br /> <b>Synaptic consolidation</b> and <b>Complementary Learning Systems
(CLS)</b> are two theories that have been proposed in the neuroscience
literature to explain how humans perform continual learning. The first theory
proposes that a proportion of synapses in our neocortex becomes less
<i>plastic</i> to retain information for a longer timescale. The second theory
suggests that two learning systems are present in our brain: 1) the neocortex
slowly learns generalizable structured knowledge 2) the hippocampus performs
rapid learning of new experiences. The experiences stored in the the hippocampus
are consolidated and replayed to the neocortex in the form of episodic memories
to reinforce the synaptic connections. 

<br />
One of the fundamental premises of neuroscience is <b>Hebbian learning</b> [3], which
suggests that learning and memory in biological neural networks are
attributed to weight plasticity, that is, the modification of the strength of
existing synapses according to variants of Hebb’s rule [7, 8].

<br /> <b>Quick Summary</b> <br /> <br /> In our paper, we extend
<i>differentiable plasticity</i> [6] to a continual learning setting and develop
a model that is able to adapt quickly to changing environments as well as
consolidating past knowledge by dynamically adjusting the plasticity of
synapses. In the softmax layer, we augment the traditional (slow) weights used
to train DNNs with a set of plastic (fast) weights using <b>Differentiable
Hebbian Plasticity (DHP)</b>. This allows the plastic weights to behave as an
auto-associative memory that can rapidly bind deep representations of the data
from the penultimate layer to the class labels. We call this new softmax layer
as the <b>DHP-Softmax</b>. We also show the flexibility of our model by
combining it with popular task-specific synaptic consolidation methods in the
literature such as: elastic weight consolidation (EWC) [4, 9], synaptic
intelligence (SI) [10] and memory aware synapses (MAS) [1]. Our model is
implemented using the PyTorch framework and trained on a single Nvidia Titan V.

<br /> <b>Our Model</b> <br />

<br /> Each synaptic connection in our model is composed of two weights:

* The slow weights $$\theta \in \mathbb{R}^{m \times d}$$, where $$m$$ is the
  number of units in the final hidden layer and $$d$$ is the number of classes.

~~~
# Initialize fixed (slow changing) weights with He initialization.
self.w = nn.Parameter(torch.Tensor(self.in_features, self.out_features))
nn.init.kaiming_uniform_(self.w, a=math.sqrt(5))
~~~
{: .language-python}
* The Hebbian plastic component of the same cardinality as the slow weights and
  made up of two components:
  * Hebbian trace, $$\mathrm{Hebb}$$ -- accumulates the mean hidden activations
    of the mean activations of the penultimate layer for each target label in
    the mini-batch during training which are denoted by $$\tilde{h} \in \mathbb{R}^{1
    \times m}$$ (using Algorithm 1 as shown below).
  * Plasticity coefficient, $$\alpha$$ -- adjusts the magnitude of
    $$\mathrm{Hebb}$$.

~~~
# The alpha scaling coefficients of the plastic connections.
self.alpha = nn.Parameter((0.01 * torch.rand(self.in_features, self.out_features)), requires_grad=True)

# The learning rate of plasticity (the same for all plastic connections)
self.eta = nn.Parameter((self.eta_rate * torch.ones(1)), requires_grad=True)
~~~
{: .language-python}

<br />
Given the activation of each neuron in $h$ at the pre-synaptic connection $i$,
the unnormalized log probabilities $z$ at the post-synaptic connection $j$ can
be computed as follows:

$$z_j = \sum_{i = 1}^{m}(\underbrace{\theta_{i,j}}_{\text{slow}} + \underbrace{\alpha_{i,j}\mathrm{Hebb}_{i,j}}_{\text{plastic (fast)}})h_i$$

<br />
Then, we apply the softmax function on $$z$$ to obtain the desired logits
$$\hat{y}$$ thus, $$\hat{y} = \mathrm{softmax}(z)$$. The parameters
$$\alpha_{i,j}$$ and $$\theta_{i,j}$$ are optimized by gradient descent as the
model is trained sequentially on different tasks $$T_{1:nmax}$$, where $$nmax$$
is the maximum number of tasks in the respective continual learning benchmarks
we experimented on.

<br /> <b>Hebbian Update Rule</b> <br />

<br />
The Hebbian traces $$\mathrm{Hebb}$$ are updated as follows:

$$\mathrm{Hebb}_{i,j} := (1-\eta)\mathrm{Hebb}_{i,j} +  \eta \tilde{h}_{i,j}$$

<br />
where, $$\eta$$ is the Hebbian learning rate that learns how quickly to acquire new
experiences into the plastic component. Here, $$\eta$$ also behaves as a decay term to
prevent a positive feedback loop in the $$\mathrm{Hebb}$$.

<br />
At the start of training the first task $T_{1}$, we initialize $$\mathrm{Hebb}$$ to zero:

~~~
def initial_zero_hebb(self, device='cuda'):
    self.device = device
    return Variable(torch.zeros(self.in_features, self.out_features), 
                requires_grad=False).to(self.device)
~~~
{: .language-python}

Then we update the Hebbian traces in the forward pass using Algorithm 1 (see
below). On line 6, we perform the Hebbian update for the corresponding class,
$$c$$. This hebbian update method forms a compressed episodic memory in the
$$\mathrm{Hebb}$$ that represents the memory traces for each unique class,
$$c$$, in the mini-batch.  Across the model’s lifetime, we only update
$$\mathrm{Hebb}$$ during training and during test time, we use the most recent
Hebbian traces to perform inference. 

<br />
$$\hspace{60pt}$$ ![Frame]({{site.baseurl}}/images/alg1.png){: height="400px" width="400px"}

~~~
def forward(self, h, y, hebb):
    # Only update Hebbian traces during training.
    if self.training:
        for _, c in enumerate(torch.unique(y)):
            # Get indices of corresponding class, c, in y.
            y_c_idx = (y == c).nonzero()
            # Count total occurences of corresponding class, c in y.
            s = torch.sum(y == c)

            if s > 0:
                h_bar = torch.div(torch.sum(h[y_c_idx], 0), s.item())
                hebb[:,c] = torch.add(torch.mul(torch.sub(1, self.eta), 
                                hebb[:,c].clone()), torch.mul(h_bar, self.eta)) 

    # Compute softmax pre-activations with plastic (fast) weights.
    z = torch.mm(h, self.w + torch.mul(self.alpha, hebb))
    
    return z, hebb
~~~
{: .language-python}

<br /> <b>Hebbian Update Visualization</b> <br />
<br />
An example of a Hebbian update for the active class c = 1 (see Line 4 in Algorithm 1):
$$\hspace{60pt}$$ ![Frame]({{site.baseurl}}/images/icmldraw19_1.svg){: height="800px" width="800px"}

<br /> <b>Updated Quadratic Loss</b> <br />

<br/>
Following the quadratic loss in the existing work for overcoming catastrophic forgetting such as EWC,
Online EWC, SI and MAS, we regularize the loss, $$\mathcal{L}^{n}(\theta, \alpha, \eta)$$, where
$$\Omega_{i,j}$$ is an importance measure for each slow weight $$\theta_{i,j}$$
and determines how plastic the connections should be. Here, least plastic
weights can retain memories for a longer period of time whereas, more plastic
weights are considered less important.

$$\tilde{\mathcal{L}}^{n}(\theta, \alpha, \eta) = \mathcal{L}^{n}(\theta, \alpha, \eta) + \underbrace{\lambda\sum_{i,j}\Omega_{i,j}(\theta_{i,j}^{n} - \theta_{i,j}^{n-1})^{2}}_{\text{regularizer}}$$

<br/>
where, $$\theta_{i,j}^{n-1}$$ are the learned network parameters after training on the previous $$n − 1$$ tasks and $$\lambda$$ is a hyperparameter for the regularizer to control the amount of forgetting. 

<br/>
We adapt these existing synaptic consolidation approaches to DHP-Softmax and
only compute the $$\Omega_{i,j}$$ on the slow weights of the network. The
plastic part of our model can alleviate catastrophic forgetting of learned
classes by optimizing the plasticity of the synaptic connections.


<br /> <b>Experiments: SplitMNIST Benchmark</b> <br />
<br />
A sequence of $$T_{n=1:5}$$ tasks are generated by splitting the original MNIST
training dataset into a sequence of 5 binary classification tasks: $$T_1 =
\{0/1\}$$, $$T_2 = \{2/3\}$$, $$T_3 = \{4/5\}$$, $$T_4 = \{6/7\}$$ and $$T_5 =
\{8/9\}$$, making the output spaces disjoint between tasks. We trained a
multi-headed MLP network with two hidden layers of 256 ReLU nonlinearities each,
and a cross-entropy loss. We compute the cross-entropy loss,
$$\mathcal{L}(\theta)$$, at the softmax output layer for the digits present in
the current task, $$T_n$$. We train the network sequentially on all 5 tasks
$$T_{n=1:5}$$ with mini-batches of size 64 and optimized using plain SGD with a
fixed learning rate of 0.01 for 10 epochs. More details on experimental setup
and hyperparameter settings can be found in the Appendix section our paper.

<br />
$$\hspace{60pt}$$ ![Frame]({{site.baseurl}}/images/benchmark.svg){: height="400px" width="400px"}

<br />
We observe that DHP Softmax provides a 4.7% improvement on test performance
compared to a finetuned MLP network (refer to the graph above). Also, combining
DHP Softmax with task-specific consolidation consistently improves performance
across all tasks $$T_{n=1:5}$$.

<br /><b>Conclusion</b><br/>
We show that catastrophic forgetting can be alleiviated by adding our DHP
Softmax to a DNN. Also, we demonstrate the flexibility and simplicity of our
approach by combining it with Online EWC, SI and MAS to regularize the slow
weights of the network. We do not introduce any additional hyperparameters as
all of the hyperparameters of the plastic component are learned dynamically by
the network during training. Finally, we hope this will foster new progress in
continual learning where, methods involving gradient-optimized Hebbian
plasticity can be used for learning and memory in DNNs.

<br /><b>Future Work</b><br/>
A natural extension of our work would be to apply DHP throughout all of the
layers in a feed forward neural network. Also, the current model relies on
labels to "auto-associate" the classes to deep representations. An interesting
line of work would be to perform the Hebbian update with a self-supervised
representation learning technique. It would also be interesting to see how this
approach will perform in the truly online setting where the network is expected
to maximize forward transfer from a small number of data points to learn new
tasks efficiently in a continual learning environment.

<br /><b>More Details</b><br/>
You can also read our <a href="" target="_blank">ICML 2019 Adaptive and
Multi-Task Learning: Algorithms & Systems Workshop</a> paper <a
href="https://openreview.net/forum?id=r1x-E5Ss34" target="_blank"><b>Differentiable
Hebbian Plasticity for Continual Learning</b></a>.

<br /><b>References</b><br/>

<br />
[1] Aljundi, R., Babiloni, F., Elhoseiny, M., Rohrbach, M., and
Tuytelaars, T. Memory aware synapses: Learning what
(not) to forget. In <i>The European Conference on Computer
Vision (ECCV)</i>, September 2018.

<br />
[2] French, R. Catastrophic forgetting in connectionist networks. <i>Trends in Cognitive Sciences</i>, 3(4):128–135, 1999.

<br />
[3] Hebb, D. O. <i>The organization of behavior; a neuropsychological theory</i>. Wiley, Oxford, England, 1949.

<br />
[4] Kirkpatrick, J., Pascanu, R., Rabinowitz, N., Veness, J., Desjardins, G., Rusu, A. A., Milan, K., Quan, J., Ramalho,
T., Grabska-Barwinska, A., Hassabis, D., Clopath, C.,
Kumaran, D., and Hadsell, R. Overcoming catastrophic
forgetting in neural networks. <i>Proceedings of the National Academy of Sciences (PNAS)</i>, 114(13):3521–3526,
March 2017.

<br />
[5] McCloskey, M. and Cohen, N. J. Catastrophic interference in connectionist networks: The sequential learning problem. <i>The Psychology of Learning and Motivation</i>, 24: 104–169, 1989.

<br />
[6] Miconi, T., Stanley, K. O., and Clune, J. Differentiable plasticity: training plastic neural networks with backpropagation. In <i>Proceedings of the 35th International Conference
on Machine Learning (ICML)</i>, pp. 3556–3565, 2018.

<br />
[7] Oja, E. Oja learning rule. Scholarpedia, 3(3):3612, 2008

<br />
[8] Paulsen, O. and Sejnowski, T. J. Natural patterns of activity
and long-term synaptic plasticity. <i>Current Opinion in
Neurobiology</i>, 10(2):172 – 180, 2000.

<br />
[9] Schwarz, J., Czarnecki, W., Luketina, J., GrabskaBarwinska, A., Teh, Y. W., Pascanu, R., and Hadsell, R.
Progress & compress: A scalable framework for continual
learning. In <i>Proceedings of the 35th International Conference on Machine Learning (ICML)</i>, pp. 4535–4544,
2018.

<br />
[10] Zenke, F., Poole, B., and Ganguli, S. Continual learning
through synaptic intelligence. In <i>Proceedings of the 34th
International Conference on Machine Learning (ICML)</i>,
pp. 3987–3995, 2017.