# RAG

![The Fog Warning by Winslow Homer, 1885](imgs/cover.jpg)

Chatbots are trained to predict the most likely sequence of words in response to a given prompt. This is why, oftentimes, they tend to hallucinate, since this method of generation doesn't actually have any recourse to truth. In theory, you could create a model that responds fluently in a given language by while speaking complete nonesense. Of course, this is dependent on the training data. In real life, the training data tends to consist of mostly truthful information, so the model learns to respond with mostly truthful information. However, if the data is flawed, or simply new or rare, the models will hallucinate information to predict the most likely response. This is a problem, especially in cases where the model is being used to provide information to users.

Retrieval-Augmented Generation is a way of solving this problem. Essentially, we tell the model what information to use in a response and generate based off of that. Of course, this still isn't bullet-proof, but it does decrease the probability of a hallucination.

Other advantages of RAG include narrowing context (for example, if you only want a model to respond based on a specific author's work), updating information (data that has come in after the model was trained), citations, and customization (instead place fine-tuning).

With a hybrid approach making use of RAG, we solve a variety of problems.

## Math Explained

### Maximum A Posteriori Estimation

### Kullback-Leibler Divergence

### Cosine Similarity

### Vector Databases

### Search Algorithms

## Real-World Considerations

## Project

To demonstrate RAG, I've implemented a simple RAG-based chatbot that's deploying on a small LLM. It's designed to answer questions based on specific philosophies. For example, if you ask it a question about the nature of reality from the perspective of Plato, it will respond based on Plato's works. A more personalized project would be to create an RAG-based chatbot to generate based off of the user's personal data (for example, a company-based resume writer that compares the user's projects with the company's requirements and writes a fresh resume based on that).
