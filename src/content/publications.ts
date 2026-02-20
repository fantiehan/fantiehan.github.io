import type { Publication } from "@/content/types";
import instancecap from "@/assets/fig/instancecap.png";
import motionsight from "@/assets/fig/Motionsight.png";
import openvid from "@/assets/fig/openvid.jpg";
import ultrahr from "@/assets/fig/UltraHR100k.png";
import solidSolution from "@/assets/fig/Solid-Solution.png";

export const publications: Publication[] = [
  {
    id: "fan2025instancecap",
    title: "InstanceCap: Improving Text-to-Video Generation via Instance-Aware Structured Caption",
    venue: "CVPR",
    year: 2025,
    type: "conference",
    authors:
      "Tiehan Fan, Kepan Nan, Rui Xie, Penghao Zhou, Zhenheng Yang, Chaoyou Fu, Xiang Li, Jian Yang, Ying Tai",
    contributionTag: "First Author",
    screenshotUrl: instancecap,
    screenshotPrompt:
      "minimal abstract paper figure, instance-aware structured captions, text-to-video generation, clean diagram on dark background, crisp typography",
  },
  {
    id: "du2025motionsight",
    title: "MotionSight: Boosting Fine-Grained Motion Understanding in Multimodal LLMs",
    venue: "ICLR",
    year: 2026,
    type: "conference",
    authors:
      "Yipeng Du, Tiehan Fan, Kepan Nan, Rui Xie, Penghao Zhou, Xiang Li, Jian Yang, Zhenheng Yang, Ying Tai",
    contributionTag: "Co-First Author",
    screenshotUrl: motionsight,
    screenshotPrompt:
      "minimal abstract paper figure, fine-grained motion understanding, multimodal LLM, clean chart and timeline, dark elegant background",
  },
  {
    id: "nan2024openvid",
    title: "OpenVid-1M: A Large-Scale High-Quality Dataset for Text-to-Video Generation",
    venue: "ICLR",
    year: 2025,
    type: "conference",
    authors:
      "Kepan Nan, Rui Xie, Penghao Zhou, Tiehan Fan, Zhenheng Yang, Zhijie Chen, Xiang Li, Jian Yang, Ying Tai",
    contributionTag: "",
    screenshotUrl: openvid,
    screenshotPrompt:
      "minimal abstract paper figure, dataset overview for text-to-video generation, grid of thumbnails as placeholder, dark modern",
  },
  {
    id: "zhao2025ultrahr",
    title: "UltraHR-100K: Enhancing UHR Image Synthesis with a Large-Scale High-Quality Dataset",
    venue: "NeurIPS",
    year: 2025,
    type: "conference",
    authors:
      "Chen Zhao, En Ci, Yunzhe Xu, Tiehan Fan, Shanyan Guan, Yanhao Ge, Jian Yang, Ying Tai",
    contributionTag: "",
    screenshotUrl: ultrahr,
    screenshotPrompt:
      "minimal abstract paper figure, ultra-high-resolution image synthesis, dataset scale infographic, dark premium style",
  },
  {
    id: "fan2023effective",
    title:
      "An Effective Framework for Predicting Performance of Solid-Solution Copper Alloys Using a Feature Engineering Technique in Machine Learning",
    venue: "Metals (JCR Q2)",
    year: 2023,
    type: "journal",
    authors: "Tiehan Fan, Jianxin Hou, Jian Hu",
    contributionTag: "Co-First Author",
    screenshotUrl: solidSolution,
    screenshotPrompt:
      "minimal abstract paper figure, materials science machine learning, feature engineering workflow diagram, dark clean",
  },
];

export const selectedPublicationIds = [
  "fan2025instancecap",
  "du2025motionsight",
  "nan2024openvid",
];
