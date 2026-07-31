import type { Publication } from "@/content/types";
import tcaCaptioner from "@/assets/fig/TCA-captioner.webp";
import openvidPlusPlus from "@/assets/fig/openvid-plusplus.webp";
import instancecap from "@/assets/fig/instancecap.webp";
import motionsight from "@/assets/fig/motionsight.webp";
import openvid from "@/assets/fig/openvid.webp";
import ultrahr from "@/assets/fig/ultrahr100k.webp";
import solidSolution from "@/assets/fig/solid-solution.webp";
import tcaCaptionerPoster from "@/assets/posters/tca-captioner.webp";
import openvidPlusPlusPoster from "@/assets/posters/openvid-plusplus.webp";
import instancecapPoster from "@/assets/posters/instancecap.webp";
import motionsightPoster from "@/assets/posters/motionsight.webp";
import openvidPoster from "@/assets/posters/openvid.webp";
import ultrahrPoster from "@/assets/posters/ultrahr.webp";
import solidSolutionPoster from "@/assets/posters/solid-solution.webp";

export const publications: Publication[] = [
  {
    id: "nan2026openvidplusplus",
    title: "OpenVid++: A Large-scale High-quality Dataset for Text-to-video Generation",
    venue: "IJCV",
    year: 2026,
    type: "journal",
    authors:
      "Kepan Nan, Tiehan Fan, Rui Xie, Penghao Zhou, Yilin Zhang, Xiang Li, Jian Yang, Zhenheng Yang, Xiaoming Liu, Ying Tai",
    contributionTag: "Co-First Author",
    screenshotUrl: openvidPlusPlus,
    screenshotPrompt:
      "OpenVid++ text-to-video dataset comparison, expressive motion-aware captions, high-quality video dataset",
    poster: {
      archive: "ijcv 2026",
      shortTitle: "OpenVid++",
      concept: "million-scale video data, refined again",
      accent: "#d84a2b",
      layout: "dataset-grid",
      meta: "forthcoming journal / text-to-video dataset",
      caption: "High-quality T2V data with motion-aware captions",
      imageUrl: openvidPlusPlusPoster,
    },
  },
  {
    id: "zhao2026tca",
    title: "Temporal and Cross-Modal Alignment for Enhanced Audiovisual Video Captioning",
    venue: "ECCV",
    year: 2026,
    type: "conference",
    authors:
      "Chen Zhao, Jiajun Ma, Qilong Huang, Tiehan Fan, Hongyu Li, Zhuoliang Kang, Xiaoming Wei, Jian Yang, Ying Tai",
    contributionTag: "",
    screenshotUrl: tcaCaptioner,
    paperUrl: "https://arxiv.org/abs/2607.01667",
    scholarUrl:
      "https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=F11LXvYAAAAJ&citation_for_view=F11LXvYAAAAJ:UeHWp8X0CEIC",
    screenshotPrompt:
      "observer-checker-corrector framework for temporal and cross-modal alignment in audiovisual video captioning",
    poster: {
      archive: "eccv 2026",
      shortTitle: "TCA Captioner",
      concept: "temporal and cross-modal alignment",
      accent: "#0088a8",
      layout: "alignment-bridge",
      meta: "audiovisual captioning / observer-checker-corrector",
      caption: "Temporal alignment for grounded audiovisual captions",
      imageUrl: tcaCaptionerPoster,
    },
  },
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
    poster: {
      archive: "cvpr 2025",
      shortTitle: "Instance Cap",
      concept: "one instance lifted from the whole",
      accent: "#1f3fb0",
      layout: "lifted-cell",
      meta: "first author / structured captions",
      caption: "Instance-aware captions for text-to-video generation",
      imageUrl: instancecapPoster,
    },
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
    poster: {
      archive: "iclr 2026",
      shortTitle: "Motion Sight",
      concept: "motion separated from camera drift",
      accent: "#d1452c",
      layout: "motion-thread",
      meta: "co-first author / motion reasoning",
      caption: "Fine-grained motion understanding in multimodal LLMs",
      imageUrl: motionsightPoster,
    },
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
    poster: {
      archive: "iclr 2025",
      shortTitle: "Open Vid 1M",
      concept: "a field of curated clips",
      accent: "#2f6b45",
      layout: "dataset-grid",
      meta: "dataset / text-to-video",
      caption: "Million-scale high-quality text-to-video dataset",
      imageUrl: openvidPoster,
    },
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
    poster: {
      archive: "neurips 2025",
      shortTitle: "Ultra HR",
      concept: "resolution opened into a window",
      accent: "#5b3b8c",
      layout: "resolution-window",
      meta: "dataset / image synthesis",
      caption: "Large-scale data for ultra-high-resolution synthesis",
      imageUrl: ultrahrPoster,
    },
  },
  {
    id: "fan2023effective",
    title:
      "An Effective Framework for Predicting Performance of Solid-Solution Copper Alloys Using a Feature Engineering Technique in Machine Learning",
    venue: "Metals (JCR Q2)",
    year: 2023,
    type: "journal",
    authors: "Tiehan Fan, Jianxin Hou, Jian Hu",
    contributionTag: "First Author",
    screenshotUrl: solidSolution,
    screenshotPrompt:
      "minimal abstract paper figure, materials science machine learning, feature engineering workflow diagram, dark clean",
    poster: {
      archive: "metals 2023",
      shortTitle: "Copper Alloy",
      concept: "features pressed into a sheet",
      accent: "#c88a1e",
      layout: "alloy-sheet",
      meta: "first author / feature engineering",
      caption: "Feature engineering for copper alloy performance prediction",
      imageUrl: solidSolutionPoster,
    },
  },
];

export const selectedPublicationIds = [
  "nan2026openvidplusplus",
  "zhao2026tca",
  "fan2025instancecap",
  "du2025motionsight",
  "nan2024openvid",
];
