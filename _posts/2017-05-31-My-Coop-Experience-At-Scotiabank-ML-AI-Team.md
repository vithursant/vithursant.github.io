---
layout: post
title: "My Co-op Experience At Scotiabank's ML and AI Team"
date: 2017-05-31
desc: "My Co-op Experience At Scotiabank's ML and AI Team"
keywords: "deep learning,tensorflow,fintech,career,blog"
categories: [Deep Learning]
tags: [deep learning,fintech]
icon: icon-html
---

*This post was first published on 31/05/17, and has since been migrated to GitHub pages.*

<p align="center">
  <b>"Disclaimer: I do not represent Scotiabank and all views expressed here are my own."</b><br>
</p>  

Over my last 3 years of undergrad, I've had the incredible privilege of doing my co-op terms with Jamdeo (Flextronics & HiSense Joint Venture), Evertz Microsystems and ON Semiconductor. Here, I experienced working in three very different industries: mobile development for Internet of Things (IoT), video compression and biomedical wireless tech.

For my last co-op term, I worked as a Data Scientist with Scotiabank's Machine Learning (ML) and Artificial Intelligence (AI) team. This one turned out to be a huge turning point in my career and for my personal growth. #PivotalLifeMoment 

I hope this post will provide a glimpse of how Deep Learning and AI is transforming the future of FinTech, and maybe even a perspective on what opportunities are available in this field.

## The Debut
Going into the term, I had no idea what project I'd be working on, what their expectations were of me or whether I'd even be doing any data science work. All I knew was my salary, the two Senior Data Scientists who interviewed me and some background in machine learning.

The first week, I was asked to continue the work on a Text Analytics project, where I had to make sense of unstructured feedback by aggregating all of this data, spotting trends and detecting the emotion  (which can be complicated). This involved natural language processing (NLP), sentiment analysis and machine learning.

## Chatbot: Deep Learning or Deep End?
Second week, my manager approaches me and goes, *"Vithu, I need you to start work on this project that's been given top priority by our Director."* 

Obviously, being a keener co-op I ask, *"Sure, sounds good. What's the project?".*

And he replies, *"Its a Chatbot project for financial services."* 

Again, obviously, I'm going to say *"that's awesome"*, put my current work on hold and got started right away. But, who knew this would end up being the most challenging project I've ever worked on in my life? (Hint: Nobody.)

Initially, my work involved a lot of preliminary research in designing a commercial chatbot. First of all, you may ask, what are these chatbots? According to my Google Assistant,

<p align="center">
  <b>"Chatbot is a computer program designed to simulate conversation with human users, especially over the Internet."</b><br>
</p>

To start, I read a ton of academic papers on natural conversational modelling and generative dialogue using deep learning:

  + [A Neural Conversational Model](https://arxiv.org/pdf/1506.05869.pdf) by Vinyals and Le
  + [Multiresolution Recurrent Neural Networks: An Application to Dialogue Response Generation](https://arxiv.org/pdf/1606.00776.pdf) by Serban, Klinger, Tesauro, Talamadupula, Zhou, Bengio and Courville
  + [A Persona-Based Neural Conversation Model](https://arxiv.org/pdf/1603.06155.pdf) by Li, Galley, Brockett, Spithourakis, Gao and Dolan

<p align="center">
  <b>"Seriously, never thought I'd be working on a deep learning project for my co-op. Felt like I was thrown into the deep end without a life jacket."</b><br>
</p>

Anyways, after understanding the latest techniques in generative dialogue, I looked into several public and private dialogue corpuses such as:

  + [Cornell Movie-Dialogs Corpus](https://www.cs.cornell.edu/~cristian/Cornell_Movie-Dialogs_Corpus.html) (small corpus containing fictional conversations extracted from raw movie scripts)
  + [OpenSubtitles](https://www.opensubtitles.org/en/search/vip) (huge collection of translated movie subtitles, but noisier)
  + [Ubuntu Dialogue Corpus](http://dataset.cs.mcgill.ca/ubuntu-corpus-1.0/) (a dataset containing almost 1 million multi-turn dialogues)
  + Scotiabank's own Live Chat data

Now the hard part, I began implementing the deep learning model using TensorFlow. I trained my models using GPU-enabled instances on Amazon Web Services (AWS) and used DevOps tools such as Docker to containerize my application so it could be scaled and deployed on the cloud for production environments. Being in an agile environment, it was by far the fastest one I've worked in, which continually pushed me to strive for my best.

## The Aftermath
So, 4 months in and I've completed three revisions of a proof-of-concept AI Chatbot system with an elegant Django web interface. Over the course of the last 3 months, I did presentations and demos for several business units and a number of stakeholders, resulting in really positive feedback. 

It's clear that AI is already one of the defining trends in FinTech in 2017, and I'm really glad I was apart of it at Scotiabank. The AI Chatbot project was an eye-opener for me and made me realize what I was truly passionate about. As a "systems-thinking" guy, I enjoy working in different disciplines, and for me...

<p align="center">
  <b>"AI is an interdisciplinary field that requires knowledge in engineering, computer science, mathematics, psychology, biology and philosophy."</b><br>
</p>

Even now, I'm still a bit bewildered at how fortunate I was to do my co-op at Scotiabank's ML and AI team, full of the best of the best of the best. It would not have been possible without well-placed encouragement from friends, mentors, co-workers who believed in me, and I am forever grateful to them. Realistically, no company is perfect and anyone who says otherwise is either a beneficiary of the status quo, lying, or just plain naive. Although I was offered full-time and declined it (long story), I'd definitely consider going back full-time (contingent on them wanting me back!). 

So, what's next for me? I started my Master of Applied Science (MASc) in Machine Learning and Artificial Intelligence this May 2017, and I'll be focusing on deep learning and high performance computing (HPC).

Post your comments below.
