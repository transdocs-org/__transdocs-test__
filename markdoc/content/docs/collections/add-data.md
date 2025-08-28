# 向 Chroma 集合中添加数据

使用 `.add` 方法将数据添加到 Chroma 集合中。该方法接收一个唯一的字符串 `ids` 列表和一个 `documents` 列表。Chroma 将使用集合的[嵌入函数](../embeddings/embedding-functions)自动为这些文档生成嵌入向量，同时也会存储文档本身。你还可以选择为每个添加的文档提供一个元数据字典。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    ids=["id1", "id2", "id3", ...],
    documents=["lorem ipsum...", "doc2", "doc3", ...],
    metadatas=[{"章节": 3, "节": 16}, {"章节": 3, "节": 5}, {"章节": 29, "节": 11}, ...],
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2", "id3", ...],
    documents: ["lorem ipsum...", "doc2", "doc3", ...],
    metadatas: [{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
});
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果添加的记录ID在集合中已存在，则该操作将被忽略且不会抛出任何异常。这意味着如果批量添加操作失败，你可以安全地重新执行该操作。

或者，你也可以直接提供与文档关联的 `embeddings` 列表，Chroma 将存储这些关联的文档而不自行对其进行嵌入。请注意，在这种情况下，无法保证嵌入向量与对应的文档之间存在准确的映射关系。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    ids=["id1", "id2", "id3", ...],
    embeddings=[[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    documents=["doc1", "doc2", "doc3", ...],
    metadatas=[{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
    
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2", "id3", ...],
    embeddings: [[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    documents: ["lorem ipsum...", "doc2", "doc3", ...],
    metadatas: [{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

如果提供的 `embeddings` 与集合中已索引的 embeddings 维度不同，则会引发异常。

您也可以将文档存储在其他位置，仅向 Chroma 提供 `embeddings` 和 `metadata` 列表。您可以使用 `ids` 将这些 embeddings 与存储在其他位置的文档关联起来。

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection.add(
    embeddings=[[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    metadatas=[{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
    ids=["id1", "id2", "id3", ...]
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
await collection.add({
    ids: ["id1", "id2", "id3", ...],
    embeddings: [[1.1, 2.3, 3.2], [4.5, 6.9, 4.4], [1.1, 2.3, 3.2], ...],
    metadatas: [{"chapter": 3, "verse": 16}, {"chapter": 3, "verse": 5}, {"chapter": 29, "verse": 11}, ...],
})
```
{% /Tab %}

{% /TabbedCodeBlock %}