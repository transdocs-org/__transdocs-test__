import {
  BlocksIcon,
  BookText,
  GraduationCap,
  RocketIcon,
  SquareTerminalIcon,
  WrenchIcon,
} from "lucide-react";
import { AppSection } from "@/lib/content";
import CloudIcon from "@/components/sidebar/cloud-icon";

const sidebarConfig: AppSection[] = [
  {
    id: "docs",
    name: "文档",
    default: "/overview/introduction",
    icon: BookText,
    subsections: [
      {
        id: "overview",
        name: "概览",
        pages: [
          {
            id: "introduction",
            name: "介绍",
          },
          {
            id: "getting-started",
            name: "快速开始",
          },
          {
            id: "architecture",
            name: "架构",
          },
          {
            id: "data-model",
            name: "数据模型",
          },
          {
            id: "roadmap",
            name: "路线图",
          },
          {
            id: "contributing",
            name: "贡献指南",
          },
          {
            id: "telemetry",
            name: "遥测",
          },
          {
            id: "migration",
            name: "迁移",
          },
          {
            id: "troubleshooting",
            name: "故障排除",
          },
          {
            id: "about",
            name: "关于",
          },
        ],
      },
      {
        id: "run-chroma",
        name: "运行 Chroma",
        pages: [
          { id: "ephemeral-client", name: "临时客户端" },
          { id: "persistent-client", name: "持久化客户端" },
          { id: "client-server", name: "客户端-服务器模式" },
          { id: "cloud-client", name: "云客户端" },
        ],
      },
      {
        id: "collections",
        name: "集合",
        pages: [
          { id: "manage-collections", name: "管理集合" },
          { id: "configure", name: "配置" },
          { id: "add-data", name: "添加数据" },
          { id: "update-data", name: "更新数据" },
          { id: "delete-data", name: "删除数据" },
        ],
      },
      {
        id: "querying-collections",
        name: "查询集合",
        pages: [
          { id: "query-and-get", name: "查询与获取" },
          { id: "metadata-filtering", name: "元数据过滤" },
          { id: "full-text-search", name: "全文搜索与正则表达式" },
        ],
      },
      {
        id: "embeddings",
        name: "嵌入",
        pages: [
          { id: "embedding-functions", name: "嵌入函数" },
          { id: "multimodal", name: "多模态" },
        ],
      },
      {
        id: "cli",
        name: "命令行工具",
        pages: [
          { id: "install", name: "安装 CLI" },
          { id: "browse", name: "浏览集合" },
          { id: "copy", name: "复制集合" },
          { id: "db", name: "数据库管理" },
          { id: "sample-apps", name: "安装示例应用" },
          { id: "login", name: "登录" },
          { id: "profile", name: "用户资料管理" },
          { id: "run", name: "运行 Chroma 服务器" },
          { id: "update", name: "更新 CLI" },
          { id: "vacuum", name: "清理" },
        ],
      },
    ],
  },
  {
    id: "cloud",
    name: "Chroma 云服务",
    icon: CloudIcon,
    tag: "",
    pages: [
      { id: "getting-started", name: "快速开始" },
      { id: "pricing", name: "定价" },
      { id: "collection-forking", name: "集合分叉" },
      { id: "quotas-limits", name: "配额与限制" },
    ],
  },
  {
    id: "guides",
    name: "指南",
    icon: GraduationCap,
    default: "/build/building-with-ai",
    subsections: [
      {
        id: "build",
        name: "构建",
        pages: [
          { id: "building-with-ai", name: "使用 AI 构建" },
          { id: "intro-to-retrieval", name: "检索入门" },
          // { id: "chunking", name: "分块" },
          // { id: "embeddings", name: "嵌入" },
          // { id: "organizing-collections", name: "组织集合" },
        ],
      },
      // { id: "develop", name: "开发", generatePages: true },
      {
        id: "deploy",
        name: "部署",
        pages: [
          { id: "client-server-mode", name: "客户端-服务器模式" },
          { id: "python-thin-client", name: "Python 轻量客户端" },
          { id: "performance", name: "性能" },
          { id: "observability", name: "可观测性" },
          { id: "docker", name: "Docker" },
          { id: "aws", name: "AWS" },
          { id: "azure", name: "Azure" },
          { id: "gcp", name: "GCP" },
        ],
      },
    ],
  },
  {
    id: "integrations",
    name: "集成",
    default: "chroma-integrations",
    icon: BlocksIcon,
    pages: [{ id: "chroma-integrations", name: "Chroma 集成" }],
    subsections: [
      {
        id: "embedding-models",
        name: "嵌入模型",
        generatePages: true,
      },
      {
        id: "frameworks",
        name: "框架",
        generatePages: true,
      },
    ],
  },
  {
    id: "reference",
    name: "参考",
    icon: WrenchIcon,
    default: "chroma-reference",
    pages: [{ id: "chroma-reference", name: "Chroma 参考文档" }],
    subsections: [
      {
        id: "python",
        name: "Python",
        pages: [
          { id: "client", name: "客户端" },
          { id: "collection", name: "集合" },
        ],
      },
      {
        id: "js",
        name: "JavaScript/TypeScript",
        pages: [
          { id: "client", name: "客户端" },
          { id: "collection", name: "集合" },
        ],
      },
    ],
  },
];

export default sidebarConfig;
