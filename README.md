# RAG

![The Fog Warning by Winslow Homer, 1885](imgs/cover.jpg)

Chatbots are trained to predict the most likely sequence of characters (tokens) in response to a given prompt. This method of generation is in no direct way grounded in truth, which is why hallucinations can happen. In theory, you could create a model that responds fluently in a given language by while speaking complete nonesense. Of course, this is dependent on the training data. In real life, training data tends to consist of mostly truthful information, so the model picks up true facts to incorporate. However, if the data is flawed, or simply new or rare, the models will hallucinate information to predict the most likely response.

Of course, this is a problematic for anyone trying to reliably extract information out of a language model.

Retrieval-Augmented Generation is a way of solving this problem. Essentially, it's like telling the model to cite its sources for everything it says. We add a knowledge base that has to be referred to when answering prompts. Of course, this still isn't bullet-proof, but it does decrease the probability of hallucinations.

Aside from reducing hallucations, RAG can allow language models to narrow the breadth of the context theyre using, inject updated or personalized information, create better citations, and save on token usage.

## Math

### Maximum A Posteriori Estimation

Normally, when a model is trained, it's trying to find the most likely estimator of the data distribution. Finding the "maximum a posteriori" estimator" (most likely preediction based on observations, i.e. training data) is one way of framing this problem. RAG helps us optimize for this by adding more context: we find the most likely tokens *given* the prompt and the retrieved context (which is weighted differently). This is a way of finding the most likely estimator of the data distribution given some context. This is known as maximum a posteriori estimation.

### Kullback-Leibler Divergence

### Cosine Similarity

### Vector Databases

### Types of embeddings

### Search Algorithms

Once the embeddings are finished, finding the appropriate answers from the given context is pretty easy. We simply embed the query and find the k-nearest [cosine-similarity-based](https://github.com/intelligent-username/Similarity-Metrics/#Cosine-Similarity) neighbours, and add them to the context that the language model is prompted with.

### Fine-Tuning

Although many language models are decently well-equipped to work with references out of the box, some may require fine-tuning in order to ensure that a proper, standardized structure of responses is enforced.

## Applications

### Narrowing Contexts

For example, 'answer this prompt like [X author]' to force the model to only use writings from a given author.

### Updated Information

When a model is trained, it's almost as though it's "learning" certain information about the world. If this information becomes outdated, RAG can ensure that more updated information is always available.

### Citation Enforcement

## User-Specific Customization

## Real-World Considerations

## Project

To demonstrate RAG, I've implemented a simple RAG-based chatbot that's deployed with a small LLM. It's designed to answer questions based on specific philosophies. For example, if you ask it a question about the nature of reality from the perspective of Plato, it will respond based on Plato's works. A more personalized project would be to create an RAG-based chatbot to generate based off of the user's personal data (for example, a company-based resume writer that compares the user's projects with the company's requirements and writes a fresh resume based on that).
