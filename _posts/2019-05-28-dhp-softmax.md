---
layout: post
title: ICML AMTL 2019 - Differentiable Hebbian Plasticity for Continual Learning 
description: "Gradient optimized Hebbian plasticity to help mitigate catastrophic forgetting."
comments: true
---

Deep neural networks (DNNs) are known to be prone to "forgetting", which has been
coined in the literature as <i>catastrophic forgetting</i> or <i>catastrophic interference</i>.
This limits the DNN's ability to perform continual lifelong learning as they face
the "stability-plasticity" dilemma when retaining memories. Stability refers to the preserving of existing knowledge while, plasticity refers to integrating new knowledge. 

<br />
<b>Synaptic consolidation</b> and <b>Complementary Learning Systems (CLS)</b> are two theories that have been proposed in the neuroscience literature to explain how  humans perform continual learning. The first theory proposes that a proportion of synapses in our neocortex becomes less <i>plastic</i> to retain information for a longer timescale. The second theory suggests that two learning systems are present in our brain: 1) the neocortex slowly learns generalizable structured knowledge 2) the hippocampus performs rapid learning of new experiences. The experiences stored in the the hippocampus are consolidated and replayed to the neocortex in the form of episodic memories to reinforce the synaptic connections. 

<br />
In our paper, we extend <i>differentiable plasticity</i> to a continual learning setting and develop a model that is able to adapt quickly to changing environments as well as consolidating past knowledge by dynapically adjusting the plasticity of synapses. In the softmax layer, we augment the traditional (slow) weights used to train DNNs with a set of plastic (fast) weights using <b>Differentiable Hebbian Plasticity (DHP)</b>. This allows the plastic weights to behave as an auto-associative memory that can rapidly bind deep representations of the data from the penultimate layer to the class labels. We call this new softmax layer as the <b>DHP-Softmax</b>. We also show the flexibility of our model by combining it with popular task-specific synaptic consolidation methods in the literature such as: elastic weight consolidation (EWC), synaptic intelligence (SI) and memory aware synapses (MAS). Our model is implemented using the PyTorch framework and trained on 
a single Nvidia Titan V.

<br /> <b>Our Model</b> <br />

<br />
Each synaptic connection in our model is composed of two weights:

* The slow weights $$\theta \in \mathbb{R}^{m \times d}$$, where $$m$$ is the number of units in the final hidden layer and $$d$$ is the number of classes.

~~~
# Initialize fixed (slow changing) weights with He initialization.
self.w = nn.Parameter(torch.Tensor(self.in_features, self.out_features))
nn.init.kaiming_uniform_(self.w, a=math.sqrt(5))
~~~
{: .language-python}
* The Hebbian plastic component of the same cardinality as the
slow weights and made up of two components:
  * Hebbian trace, $$\mathrm{Hebb}$$ -- accumulates the mean hidden activations of the mean activations of the penultimate layer for each target label in the mini-batch during training which are denoted by $$h \in \mathbb{R}^{1 \times m}$$ (using Algorithm 1 as shown below).
  * Plasticity coefficient, $$\alpha$$ -- adjusts the magnitude of $$\mathrm{Hebb}$$.

~~~
# The alpha scaling coefficients of the plastic connections.
self.alpha = torch.nn.Parameter((0.01 * torch.rand(self.in_features, self.out_features)), requires_grad=True)

# The learning rate of plasticity (the same for all plastic connections)
self.eta = torch.nn.Parameter((self.eta_rate * torch.ones(1)), requires_grad=True)
~~~
{: .language-python}

<br />
Given the activation of each neuron in $h$ at the pre-synaptic connection $i$, the
unnormalized log probabilities $z$ at the post-synaptic connection $j$ can be computed as follows:

$$z_j = \sum_{i \in \text{inputs to} \ j}(\underbrace{\theta_{i,j}}_{\text{slow}} + \underbrace{\alpha_{i,j}\mathrm{Hebb}_{i,j}}_{\text{fast}})h_i$$

<br />
Then, we apply the softmax function on $$z$$ to obtain the desired logits $$\hat{y}$$ thus, $$\hat{y} = \mathrm{softmax}(z)$$. The parameters $$\alpha_{i,j}$$ and $$\theta_{i,j}$$ are optimized by gradient descent as the model is trained sequentially on different tasks $$T_{1:nmax}$$, where $$nmax$$ is the maximum number of tasks in the respective continual learning benchmarks we experimented on.

<br /> <b>Hebbian Update Rule</b> <br />

<br />
At the start of training the first task $T_{1}$, we initialize $$\mathrm{Hebb}$$ to zero as follows:

~~~
def initial_zero_hebb(self, device='cuda'):
    self.device = device
    return Variable(torch.zeros(self.in_features, self.out_features), 
                requires_grad=False).to(self.device)
~~~
{: .language-python}

Then we update the Hebbian traces in the forward pass using Algorithm 1 (see below). On line 6, we perform the Hebbian update for the corresponding class, $$c$$. This hebbian update method forms a compressed episodic memory in the $$\mathrm{Hebb}$$ that represents the memory traces for each unique class, $$c$$, in the mini-batch.  Across the model’s lifetime, we only update $$\mathrm{Hebb}$$ during training and during test time, we use the most recent Hebbian traces to perform inference. 

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

<br /> <b>Updated Loss</b> <br />

<br/>
Following the existing work for overcoming
catastrophic forgetting such as EWC, Online EWC, SI and
MAS, we regularize the loss:

$$\mathcal{L}(\theta) = \mathcal{L}^{n}(\theta) + \underbrace{\lambda\sum_{i,j}\Omega_{i,j}(\theta_{i,j}^{n} - \theta_{i,j}^{n-1})^{2}}_{\text{regularizer}}$$

