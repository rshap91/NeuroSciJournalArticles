# NeuroSciJournalArticles
Topic Modeling and Clustering Neuroscience Journal Articles From PubMed

## NOTE: I took the app down as I had to pay for it. If you'd like a demo please email me at rick.shapirony@gmail.com.

Topic Modeling is the process of using your computer to generalize a piece of text based on the words contained in the text. This is different from summarizing a piece of text in that summarizing chooses the most relevant sentences in the text while topic modeling groups individual words into separate categories. You can then examine an article for which words are used most often and assign it to the category containing those words. 

Here I present one such model built from a collection of over 25 thousand Scientific Journal Articles from 275 different Journals, all in the field of Neuroscience. The model contains 14 topics which are used to generalize given scientific texts. Having a computer generate such a model can of course produce variable results and if the data is not expansive enough, or does not contain distinct themes, then the model will in turn generate weak topics that are overly general. That being said, most of the topics my model produced are very coherent and pick out many of the major themes in neuroscience research today. This includes topics related to Psychiatric Disorders, Alzheimers and Dementia, Parkinsons, Stroke and Aneurysms, and Cancer research. Looking at the top (most important) words for each topic one can easily pick out what each is about. For example the top 5 words for one such topic are: "Sleep", "REM", "Insomnia", "EEG", and "Circadian". Clearly the model picked out articles specifically about sleep and related disorders. 

In addition to the Topic Model, I built a small [flask app](http://neurosci.herokuapp.com/) that can summarize a given piece of text as well as provide recommendations to similar articles. Text summarization works in a very similar fashion to Googles Page Rank algorithm which is the basis of their search engine. The algorithm orders sentences by how "important" the words they contain are. Word importances are assigned based on how often a word appears in a sentence with other important words. I like to think of it like observing a class of high school students. If you hang out with the cool kids.. then you are probably pretty cool. 

=======
