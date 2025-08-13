# 配置 Chroma 集合

Chroma 集合具有一个 `configuration`（配置），用于决定其嵌入索引的构建和使用方式。我们为这些索引配置提供了默认值，在大多数使用场景下，开箱即用即可获得出色的性能。

您在集合中选择使用的[嵌入函数](../embeddings/embedding-functions)也会影响其索引的构建，并包含在配置中。

创建集合时，您可以根据不同的数据、准确性和性能需求自定义这些索引配置值。某些查询时的配置也可以在集合创建后通过 `.modify` 函数进行修改。

{% CustomTabs %}

{% Tab label="单节点" %}

## HNSW 索引配置

在单节点 Chroma 集合中，我们使用 HNSW（Hierarchical Navigable Small World，分层可导航小世界）索引来执行近似最近邻（ANN）搜索。

{% Accordion %}

{% AccordionItem label="什么是 HNSW 索引？" %}

HNSW（分层可导航小世界）索引是一种基于图的数据结构，专为在高维向量空间中高效执行近似最近邻搜索而设计。其工作原理是构建一个多层图结构，每一层包含数据点的一个子集，较高层更稀疏，作为“高速公路”实现更快的导航。该算法在每一层中构建邻近点之间的连接，形成“小世界”特性，从而实现高效的搜索复杂度。搜索时，算法从顶层开始，向嵌入空间中的查询点方向导航，然后逐层向下移动，在每一层细化搜索，直到找到最终的最近邻。

{% /AccordionItem %}

{% /Accordion %}

HNSW 索引参数包括：

* `space` 定义嵌入空间的距离函数，从而决定相似性的定义方式。默认值为 `l2`（平方 L2 范数），其他可选值包括 `cosine`（余弦相似性）和 `ip`（内积）。

| 距离              | parameter |                                                                                                                                                   公式 |                                                                          直觉                                                                          |
| ----------------- | :-------: |-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| 平方 L2           |   `l2`    |                                                                                                {% Latex %} d =  \\sum\\left(A_i-B_i\\right)^2 {% /Latex %} |                       衡量向量之间的绝对几何距离，适用于需要真实空间接近性的场景。                        |
| 内积              |   `ip`    |                                                                                     {% Latex %} d = 1.0 - \\sum\\left(A_i \\times B_i\\right) {% /Latex %} |             关注向量的方向和大小，常用于推荐系统，其中较大的值表示更强的偏好。              |
| 余弦相似性        | `cosine`  | {% Latex %} d = 1.0 - \\frac{\\sum\\left(A_i \\times B_i\\right)}{\\sqrt{\\sum\\left(A_i^2\\right)} \\cdot \\sqrt{\\sum\\left(B_i^2\\right)}} {% /Latex %} | 仅衡量向量之间的夹角（忽略大小），适用于文本嵌入或关心方向而非尺度的场景。 |

{% Banner type="note" %}
您应确保所选的 `space` 受集合的嵌入函数支持。每个 Chroma 嵌入函数都会指定其默认空间和支持的空间列表。
{% /Banner %}

* `ef_construction` 决定在索引创建过程中用于选择邻居的候选列表大小。值越高，索引质量越好，但会消耗更多内存和时间；值越低，构建速度更快，但准确性降低。默认值为 `100`。
* `ef_search` 决定在搜索最近邻时使用的动态候选列表大小。值越高，通过探索更多潜在邻居来提高召回率和准确性，但会增加查询时间和计算开销；值越低，搜索更快但准确性较低。默认值为 `100`。此字段可在创建后修改。
* `max_neighbors` 是索引构建过程中图中每个节点最多可拥有的邻居（连接）数量。值越高，图越密集，搜索时召回率和准确性更高，但会增加内存使用和构建时间；值越低，图越稀疏，减少内存使用和构建时间，但搜索准确性和召回率降低。默认值为 `16`。
* `num_threads` 指定索引构建或搜索操作中使用的线程数。默认值为 `multiprocessing.cpu_count()`（可用 CPU 核心数）。此字段可在创建后修改。
* `batch_size` 控制索引操作期间每批处理的向量数量。默认值为 `100`。此字段可在创建后修改。
* `sync_threshold` 决定何时将索引与持久化存储同步。默认值为 `1000`。此字段可在创建后修改。
* `resize_factor` 控制索引需要调整大小时的增长幅度。默认值为 `1.2`。此字段可在创建后修改。

例如，以下代码创建一个对 `space` 和 `ef_construction` 进行了自定义的集合：

{% TabbedCodeBlock %}

{% Tab label="python" %}
```python
collection = client.create_collection(
    name="my-collection",
    embedding_function=OpenAIEmbeddingFunction(model_name="text-embedding-3-small"),
    configuration={
        "hnsw": {
            "space": "cosine",
            "ef_construction": 200
        }
    }
)
```
{% /Tab %}

{% Tab label="typescript" %}
```typescript
collection = await client.createCollection({
    name: "my-collection",
    embeddingFunction: new OpenAIEmbeddingFunction({ modelName: "text-embedding-3-small" }),
    configuration: {
        hnsw: {
            space: "cosine",
            ef_construction: 200
        }
    }
})
```
{% /Tab %}

{% /TabbedCodeBlock %}

### 微调 HNSW 参数

在近似最近邻搜索的上下文中，**召回率（recall）** 指的是检索到的真实最近邻所占的比例。

通常，增加 `ef_search` 可以提高召回率，但会减慢查询速度。类似地，增加 `ef_construction` 可以提高召回率，但会增加索引创建时的内存占用和运行时间。

选择合适的 HNSW 参数值取决于您的数据、嵌入函数以及对召回率和性能的需求。您可能需要尝试不同的构建和搜索值，以找到满足需求的最佳组合。

例如，对于一个包含 50,000 个 2048 维嵌入的数据集，由以下代码生成：
```python
embeddings = np.random.randn(50000, 2048).astype(np.float32).tolist()
```

我们设置了两个 Chroma 集合：
* 第一个集合配置为 `ef_search: 10`。当使用集合中的特定嵌入（`id = 1`）进行查询时，查询耗时 `0.00529` 秒，返回的嵌入距离为：

```
[3629.019775390625, 3666.576904296875, 3684.57080078125]
```

* 第二个集合配置为 `ef_search: 100` 和 `ef_construction: 1000`。执行相同查询时，耗时 `0.00753` 秒（约慢 42%），但结果更优，距离值如下：

```
[0.0, 3620.593994140625, 3623.275390625]
```
在此示例中，当使用测试嵌入（`id=1`）查询时，第一个集合未能找到嵌入自身（尽管它存在于集合中，应以 `0.0` 距离返回）。而第二个集合虽然稍慢，但成功找到了查询嵌入自身（由 `0.0` 距离体现），并返回了整体更接近的邻居，展示了在性能代价下更高的准确性。

{% /Tab %}

{% Tab label="分布式和 Chroma Cloud" %}

## SPANN 索引配置

在分布式 Chroma 和 Chroma Cloud 集合中，我们使用 SPANN（Spacial Approximate Nearest Neighbors，空间近似最近邻）索引来执行近似最近邻（ANN）搜索。

{% Video link="https://www.youtube.com/embed/1QdwYWd3S1g" title="SPANN 视频" / %}

{% Accordion %}

{% AccordionItem label="什么是 SPANN 索引？" %}

SPANN 索引是一种数据结构，用于在大规模高维向量集合中高效查找近似最近邻。其工作原理是将数据集划分为多个大类（以便在搜索时忽略大部分数据），然后在每个类内部构建高效的小型索引以实现快速局部查找。这种两级结构有助于减少内存使用和搜索时间，使得在硬盘或分布式系统的独立机器上存储数十亿向量并进行搜索成为可能。

{% /AccordionItem %}

{% /Accordion %}

{% Banner type="note" %}
目前我们不允许自定义或修改 SPANN 配置。如果您设置了这些值，服务器将忽略它们。
{% /Banner %}

SPANN 索引参数包括：

* `space` 定义嵌入空间的距离函数，从而决定相似性的定义方式。默认值为 `l2`（平方 L2 范数），其他可选值包括 `cosine`（余弦相似性）和 `ip`（内积）。

| 距离              | parameter |                                                                                                                                                   公式 |                                                                          直觉                                                                          |
| ----------------- | :-------: |-----------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
| 平方 L2           |   `l2`    |                                                                                                {% Latex %} d =  \\sum\\left(A_i-B_i\\right)^2 {% /Latex %} |                       衡量向量之间的绝对几何距离，适用于需要真实空间接近性的场景。                        |
| 内积              |   `ip`    |                                                                                     {% Latex %} d = 1.0 - \\sum\\left(A_i \\times B_i\\right) {% /Latex %} |             关注向量的方向和大小，常用于推荐系统，其中较大的值表示更强的偏好。              |
| 余弦相似性        | `cosine`  | {% Latex %} d = 1.0 - \\frac{\\sum\\left(A_i \\times B_i\\right)}{\\sqrt{\\sum\\left(A_i^2\\right)} \\cdot \\sqrt{\\sum\\left(B_i^2\\right)}} {% /Latex %} | 仅衡量向量之间的夹角（忽略大小），适用于文本嵌入或关心方向而非尺度的场景。 |

* `search_nprobe` 是查询时探测的中心数量。值越高，结果越准确，但查询响应时间也随之增加。推荐值为 64 或 128。目前不允许设置高于 128 的值。默认值为 64。
* `write_nprobe` 与 `search_nprobe` 类似，但用于索引构建阶段。它是在追加或重新分配点时搜索的中心数量。其限制与 `search_nprobe` 相同。默认值为 64。
* `ef_construction` 决定在索引创建过程中用于选择邻居的候选列表大小。值越高，索引质量越好，但会消耗更多内存和时间；值越低，构建速度更快，但准确性降低。默认值为 200。
* `ef_search` 决定在搜索最近邻时使用的动态候选列表大小。值越高，通过探索更多潜在邻居来提高召回率和准确性，但会增加查询时间和计算开销；值越低，搜索更快但准确性较低。默认值为 200。
* `max_neighbors` 定义节点的最大邻居数。默认值为 64。
* `reassign_neighbor_count` 是分裂簇的最近邻簇数量，这些簇中的点会被考虑重新分配。默认值为 64。

{% /Tab %}

{% /CustomTabs %}

## 嵌入函数配置

创建集合时选择的嵌入函数及其实例化参数会持久化保存在集合的配置中。这使得在不同客户端中使用集合时，我们可以正确重建该函数。

您可以在“创建”方法中将嵌入函数作为参数传入，或直接在配置中设置：

{% Tabs %}

{% Tab label="python" %}

安装 `openai` 和 `cohere` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="pip" %}
```terminal
pip install openai cohere
```
{% /Tab %}

{% Tab label="poetry" %}
```terminal
poetry add openai cohere
```
{% /Tab %}

{% Tab label="uv" %}
```terminal
uv pip install openai cohere
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

使用嵌入函数和自定义配置创建集合：

```python
import os
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction, CohereEmbeddingFunction

# 使用 `embedding_function` 参数
openai_collection = client.create_collection(
    name="my_openai_collection",
    embedding_function=OpenAIEmbeddingFunction(
        model_name="text-embedding-3-small"
    ),
    configuration={"hnsw": {"space": "cosine"}}
)

# 在集合的 `configuration` 中设置 `embedding_function`
cohere_collection = client.get_or_create_collection(
    name="my_cohere_collection",
    configuration={
        "embedding_function": CohereEmbeddingFunction(
            model_name="embed-english-light-v2.0",
            truncate="NONE"
        ),
        "hnsw": {"space": "cosine"}
    }
)
```

**注意：** 许多嵌入函数需要 API 密钥来对接第三方嵌入服务提供商。Chroma 的嵌入函数会自动查找用于存储提供商 API 密钥的标准环境变量。例如，Chroma 的 `OpenAIEmbeddingFunction` 会在 `OPENAI_API_KEY` 环境变量被设置时，将其 `api_key` 参数设为该变量的值。

如果您的 API 密钥存储在非标准名称的环境变量中，您可以通过设置 `api_key_env_var` 参数，将嵌入函数配置为使用自定义环境变量。为了使嵌入函数正常工作，您必须在使用集合的每个环境中设置此变量。

```python
cohere_ef = CohereEmbeddingFunction(
    api_key_env_var="MY_CUSTOM_COHERE_API_KEY",
    model_name="embed-english-light-v2.0",
    truncate="NONE",
)
```

{% /Tab %}

{% Tab label="typescript" %}

安装 `@chroma-core/openai` 和 `@chroma-core/cohere` 包：

{% TabbedUseCaseCodeBlock language="Terminal" %}

{% Tab label="npm" %}
```terminal
npm install @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% Tab label="pnpm" %}
```terminal
pnpm add @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% Tab label="yarn" %}
```terminal
yarn add @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% Tab label="bun" %}
```terminal
bun add @chroma-core/openai @chroma-core/cohere
```
{% /Tab %}

{% /TabbedUseCaseCodeBlock %}

使用嵌入函数和自定义配置创建集合：

```typescript
import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import { CohereEmbeddingFunction } from "@chroma-core/cohere"

// 使用 `embedding_function` 参数
openAICollection = client.createCollection({
    name: "my_openai_collection",
    embedding_function: new OpenAIEmbeddingFunction({
        model_name: "text-embedding-3-small"
    }),
    configuration: { hnsw: { space: "cosine" } }
});

// 在集合的 `configuration` 中设置 `embedding_function`
cohereCollection = client.getOrCreate_collection({
    name: "my_cohere_collection",
    configuration: {
        embeddingFunction: new CohereEmbeddingFunction({
            modelName: "embed-english-light-v2.0",
            truncate: "NONE"
        }),
        hnsw: { space: "cosine" }
    }
})
```

**注意：** 许多嵌入函数需要 API 密钥来对接第三方嵌入服务提供商。Chroma 的嵌入函数会自动查找用于存储提供商 API 密钥的标准环境变量。例如，Chroma 的 `OpenAIEmbeddingFunction` 会在 `OPENAI_API_KEY` 环境变量被设置时，将其 `api_key` 参数设为该变量的值。

如果您的 API 密钥存储在非标准名称的环境变量中，您可以通过设置 `apiKeyEnvVar` 参数，将嵌入函数配置为使用自定义环境变量。为了使嵌入函数正常工作，您必须在使用集合的每个环境中设置此变量。

```typescript
cohere_ef = CohereEmbeddingFunction({
    apiKeyEnvVar: "MY_CUSTOM_COHERE_API_KEY",
    modelName: "embed-english-light-v2.0",
    truncate: "NONE",
})
```

{% /Tab %}

{% /Tabs %}