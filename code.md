---
layout: page
permalink: /code/
title: Some Code I've Written
tags: [code]
modified: 3-10-2014
comments: false
---


It all started when I took my first computer science class in highschool, and
going through the many trials and tribulations of programming. Since then, I've
been enjoying coding and here you can find some of the programs I've written.

### General

* [**Simplified Transformer Block for Apple
  MLX**](https://github.com/vithursant/SimplifiedTransformers_mlx)<br>
Apple MLX implementation of the Simplified Transformer architecture, as
presented in a 2023 paper. This project aims to adapt the [Simplified
Transformer model](https://arxiv.org/abs/2311.01906), which reduces the
complexity and component count of traditional Transformer models without
compromising performance, for use with Apple's MLX framework. It promises faster
training throughput and a reduced parameter count by 15% compared to standard
Transformers, targeting enhanced performance on Apple's GPUs. 

* [**nanoGPT for Apple MLX**](https://github.com/vithursant/nanoGPT_mlx)<br>
Port of Andrej Karpathy's nanoGPT to the Apple MLX framework. The project adapts
the lightweight GPT model implementation to work with Apple's machine learning
framework, making it accessible for developers working within the Apple
ecosystem.

### Research

* [**Sparse Iso-FLOP Transformations for Maximizing Training Efficiency
  (Sparse-IFT)**](https://github.com/CerebrasResearch/Sparse-IFT)<br>
Official implementation of Sparse Iso-FLOP Transformations aimed at maximizing
the training efficiency of deep neural networks. The codebase, developed in
PyTorch, supports experiments detailed in their paper which introduces a family
of Sparse Iso-FLOP Transformations. These transformations are designed to
enhance test accuracy relative to training FLOPs by employing dynamic sparsity,
particularly through the RigL algorithm, across various neural network
configurations. The repository provides comprehensive guidelines for setting up
the environment, running CIFAR-100 and ImageNet experiments with different model
configurations, and cites their paper for those interested in their research
findings.

* [**Self-Paced Learning with Adaptive Deep Visual Embeddings
  (SPL-ADVisE)**](https://github.com/vithursant/SPL-ADVisE)<br>
  Randomized mini-batches might not be an optimal training curriculum for deep
  networks. Our paper comes up with an insightful and general method for
  adaptive curriculum creation by extending self-paced learning with diversity.
  We show state-of-the-art convergence speeds to optimal test performance on
  MNIST, FashionMNIST, CIFAR-10 and CIFAR-100. From our BMVC 2018 paper.

* [**Magnet Loss for Deep Metric
  Learning**](https://github.com/vithursant/MagnetLoss-PyTorch)<br>
  PyTorch implementation of the Magnet Loss based on the paper <i>Metric
  Learning with Adaptive Density Discrimination</i> by Oren Rippel, Piotr
  Dollar, Manohar Paluri, Lubomir Bourdev from Facebook AI Research (FAIR). From
  ICLR 2016.

* [**VAE with
  Gumbel-Softmax**](https://github.com/vithursant/VAE-Gumbel-Softmax)<br>
  TensorFlow implementation of a Variational Autoencoder with Gumbel-Softmax
  Distribution based on the papers from Google Brain and DeepMind:
  <i>Categorical Reparametrization with Gumbel-Softmax</i> by Maddison, Mnih and
  Teh, <i>The Concrete Distribution: A Continuous Relaxation of Discrete Random
  Variables</i> by Jang, Gu and Poole, and <i>REBAR: Low-variance, unbiased
  gradient estimates for discrete latent variable models</i> by Tucker, Mnih,
  Maddison and Sohl-Dickstein.
 
### DevOps

* [**Provisioning AWS Spot Instances for Deep
  Learning**](https://github.com/vithursant/terraform-aws-spotgpu)<br>
  A terraform module for provisioning EC2-based Spot Instances on AWS,
  specifically for Deep Learning workloads on Amazon's GPU instances, by taking
  advantage of automation and friendly declarative configurations.

* [**Anaconda Environments for Deep
  Learning**](https://github.com/vithursant/deep-learning-conda-envs)<br>
  Several CPU-based and GPU-based anaconda environments for various deep
  learning frameworks such as PyTorch, TensorFlow and Theano.

### Miscellaneous

* [**Ackermann
  Quicksort**](https://github.com/vithursant/Ackermann-Quicksort-Experiments)<br>
  A comparative analysis of recursion in C and Python for the Ackermann function
  and Quicksort algorithm.