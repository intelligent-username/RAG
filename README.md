# RAG

![The Fog Warning by Winslow Homer, 1885](imgs/cover.jpg)

Chatbots are trained to predict the most likely sequence of characters (tokens) that should follow a given prompt. This method of generation is in no direct way grounded in truth, which is why hallucinations happen so often. In theory, you could create a model that responds fluently in a given language by while speaking complete nonesense. In most cases, training data tends to consist of largely truthful information, so the model picks up true facts to incorporate into its answers. However, if the data is flawed, or simply new or rare, the models will respond accurately.

Of course, this is a problematic for anyone trying to reliably extract information out of a language model.

Similar problems arise

Retrieval-Augmented Generation is a way of solving this problem. Essentially, it's like telling the model to cite its sources for everything it says. We add an external knowledge base that is retrieved from during every query, and pass the information from this knowledge base onto the language model as extra context to answer with. Of course, this still isn't bullet-proof, but it does decrease the probability of hallucinations.

Aside from reducing hallucations, RAG can allow language models to narrow the scope of the topic being disccused, inject updated or personalized information, create better citations, and save on token usage.

## Math

All of the math behind LLMs is essentially just the same as the [math behind neural networks](https://github.com/intelligent-username/Backpropagation?tab=readme-ov-file#neural-network-basics), except at a bigger scale (with up to a few trillion parameters). RAG is just a layer on top of that which augments the response by inserting (preferably) human-written context. The math behind RAG is simply the result of adding a single 'context' term to the equation for the probability of a given token being the next token in the sequence. The context term is weighted differently than the prompt, and is added to the equation for the probability of a given token being the next token in the sequence.

### Maximum A Posteriori Estimation

Normally, when a model is trained, it's trying to find the most likely estimator of some observed data. It's looking for the best parameters (estimators) to model the relationship between features and labels. Since models are just trained on verbal data, they basically learn to predict a series of grammatically accurate sentences, with the only truth value within those sentences coming from the information that is inherently built into the language being spoken.

RAG grounds the predictions in real-world information, helping us a language model's answer with added context: we find the most likely tokens *given* the prompt and the retrieved context (which is weighted more strongly). By forcing the model to use the retrieved data in it's answer, we have more control over the truth value of the generated response. The model can still be creative but will be ancored by the retrieved information.

Mathematiicaly, if the neural network produces the model $f(x | \theta)$, then adding the RAG would simply produce a new predictor function, $F(x | \theta, c)$, where $c$ is the retrieved context. The model is then trained to find the parameters $\theta$ that maximize the likelihood of the observed data given the prompt and the retrieved context.

### Kullback-Leibler Divergence

### Embedding Information


### Cosine Similarity

## Implementation

These are the basics for understanding how an RAG system actually works prior to implementation.

### Chunking and Indexing

### Vector Databases

### Searching

Once the embeddings are finished, finding the appropriate answers from the given context is pretty easy. We simply embed the query and find the k-nearest [cosine-similarity-based](https://github.com/intelligent-username/Similarity-Metrics/?tab=readme-ov-file#3-cosine-similarity) neighbours, and add them to the context that the language model is prompted with.

### Fine-Tuning

Although many language models are decently well-equipped to work with references out of the box, some may require fine-tuning in order to ensure that a proper, standardized structure of responses is enforced. This can be done by outright LoRA fine-tuning, meta-prompting, or generic supervised fine-tuning.

## Modifications and Advancements

Now, for cutting-edge applications, the following additions improve the process.

### Prompt Augmentation

### Multimodal Retrieval

Multi-modal retrieval is when we have multiple types of data embedded in the same vector space. For example, images and text can be embedded in the same vector space. This is actually a difficult task, as it requires alignment to be created between different types of data within the same vector space. It's an active area of research, and there are a lot of different approaches to it. One approach is to use a shared encoder for both types of data, and then fine-tune it on a multi-modal dataset. Another approach is to use separate encoders for each type of data, and then learn a mapping between the two vector spaces.

### Self-RAG

The model learns when and what to retrieve on its own, without human intervention. This is a more advanced form of RAG that bakes the retrieval process into the model itself.

### Multi-Hop and Reflective RAG

Multi-hop is when the model retrieves data multiple times. It critiques the first response, and then retrieves more data to improve the response, and continues iterating. Reflective RAG is when the model critiques its own response and then retrieves more data to improve it.

## Applications

### Narrowing Contexts

For example, 'answer this prompt like [X author]' to force the model to only use writings from a given author.

### Updated Information

When a model is trained, it's almost as though it's "learning" certain information about the world. If this information becomes outdated, RAG can ensure that more updated information is always available.

### Citation Enforcement

### User-Specific Customization

## Project

To demonstrate RAG, I've implemented a simple RAG-based chatbot that's deployed with a small LLM. It's designed to answer questions based on specific philosophies. For example, if you ask it a question about the nature of reality from the perspective of Plato, it will respond based on Plato's works. A more personalized project would be to create an RAG-based chatbot to generate based off of the user's personal data (for example, a company-based resume writer that compares the user's projects with the company's requirements and writes a fresh resume based on that).

## Credit

This project was inspired by the paper ["Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"](https://arxiv.org/abs/2005.11401) by Patrick Lewis, et al (v4; last revised 12 April 2021).
