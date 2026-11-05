import type { Note } from "@/content/types";
import bannerCaption from "@/assets/banners/caption.jpg";
import bannerMotion from "@/assets/banners/motion.jpg";
import bannerClips from "@/assets/banners/clips.jpg";
import bannerPosters from "@/assets/banners/posters.jpg";

export const notes: Note[] = [
  {
    slug: "what-a-video-caption-has-to-carry",
    title: "What a video caption has to carry",
    date: "2026-11",
    summary:
      "Text-to-video models learn from captions, so vague captions cost quality. What InstanceCap changes, and how much better the generated videos get.",
    banner: bannerCaption,
    bannerAlt: "A row of pinned insect specimens, each with a blank paper tag; only the butterfly is tinted blue.",
    accent: "#2b45a8",
    blocks: [
      {
        kind: "p",
        text: "A text-to-video model learns what words mean from clip and caption pairs. If a caption gets a detail wrong, the model trains on that error. The captions in common datasets had three recurring faults: too little detail, invented content, and imprecise descriptions of motion.",
      },
      {
        kind: "p",
        text: "The obvious fix is to ask a multimodal LLM for a longer description. That does not solve the core problem. When a model looks at a whole frame with several people in it, attributes drift between them, and a necklace or a pen can end up on the wrong person.",
      },
      { kind: "h", text: "Describe one instance at a time" },
      {
        kind: "p",
        text: "InstanceCap prepares the video before the LLM sees it. A detector finds each instance, SAM2 segments it across the clip, and everything outside it is blurred. The LLM then describes that one instance. We compared this with red circles, bounding boxes, grayscale backgrounds and solid-color masks. Circles, boxes and grayscale still let attributes blend across instances, and solid color often pushed the LLM to add wrong context. Blur keeps the scene natural while making the target unmistakable.",
      },
      {
        kind: "p",
        text: "The output is structured. Each video gets a one-sentence global description, a background description and a camera movement description. Each instance gets a class, a position, an appearance description and an actions and motion description.",
      },
      {
        kind: "figure",
        publicationId: "fan2025instancecap",
        caption: "Captions for the same clip from InstanceCap and three other methods. Green marks useful detail, red marks errors, and blue marks ambiguity.",
      },
      { kind: "h", text: "How we measured it" },
      {
        kind: "p",
        text: "Caption quality is hard to score directly, so we fed captions for 100 clips into CogVideoX-5b and compared each generated video with the original. A lower 3DVAE score means the two are closer.{1}",
        notes: ["Clips came from OpenVid-1M and Animal Kingdom. For scale, the paper lists 134 to 145 for text-to-video models and 149.50 for a broken video."],
      },
      {
        kind: "table",
        caption: "Reconstruction via caption, 100 clips.",
        head: ["Method", "3DVAE score", "CLIP sentence score", "Average words"],
        rows: [
          ["InstanceCap", "134.25", "0.2133", "157"],
          ["MiraData (GPT-4o)", "137.50", "0.2156", "263"],
          ["LLaVA-Video-72B", "139.88", "0.2060", "102"],
          ["Panda-70M", "140.25", "0.1956", "13"],
          ["ShareGPT4Video", "141.00", "0.2132", "191"],
        ],
      },
      {
        kind: "p",
        text: "Length is not what wins here. InstanceCap reconstructs the original clips most faithfully while using about 40% fewer words than the longest captions in the table.{1} The structure, not the word count, carries the information.",
        notes: ["157 words against MiraData's 263, which is about 40% fewer."],
      },
      {
        kind: "p",
        text: "The test closer to real use was training. We fine-tuned Open-Sora v1.2 on InstanceVid, a 22K-video dataset selected from OpenVid-1M and captioned this way, then ran more than 200 instance-focused checks.{1} The average success rate rose from 28.63% to 37.88%. The largest gains were single action (40% to 56%), multiple color (16% to 32%) and single detail (13% to 27%).",
        notes: ["The checks, called Inseval, cover action, color, shape, texture and detail. A prompt with several objects passes only if every target is correct."],
      },
      { kind: "h", text: "From training captions to user prompts" },
      {
        kind: "p",
        text: "A model trained on long, structured captions expects prompts in the same form, while people type short ones. InstanceEnhancer closes that gap without any tuning. It first expands a short prompt, then uses the short and expanded versions together to pick out each instance and describe it in the training format, keeping every instance consistent with its scene.",
      },
    ],
    sources: [
      { label: "InstanceCap on arXiv", href: "https://arxiv.org/abs/2412.09283" },
      { label: "Code and data", href: "https://github.com/NJU-PCALab/InstanceCap" },
    ],
  },
  {
    slug: "two-kinds-of-motion",
    title: "Two kinds of motion, two visual prompts",
    date: "2026-11",
    summary:
      "MotionSight improves motion understanding without any training, only by changing what the model sees. Camera-motion accuracy on MotionBench rises from 34.0 to 48.3.",
    banner: bannerMotion,
    bannerAlt: "Reeds bending in the wind, with one small green butterfly and its dotted flight path.",
    accent: "#6f7d34",
    blocks: [
      {
        kind: "p",
        text: "Multimodal LLMs read video poorly when the answer depends on small movements. They do not compare frames well, and subtle changes are easy to miss. MotionSight asks how far this can be improved with no training at all, only by changing the frames the model receives.",
      },
      {
        kind: "p",
        text: "The key decision is to treat object motion and camera motion as separate problems. They look similar in pixels but need different evidence. The question decides the route: a question about an object goes to one visual prompt, and a question about the camera goes to the other.",
      },
      { kind: "h", text: "Object motion: a spotlight" },
      {
        kind: "p",
        text: "The LLM names the objects relevant to the question. GroundingDINO locates them in a key frame, SAM2 tracks them, and a temporal aggregator smooths out box jitter. Everything outside the boxes is then darkened, with a darken factor of 0.9, while the objects stay in place at full brightness.{1}",
        notes: ["Appendix A.1. A sweep in the appendix puts the best object-motion score at this value."],
      },
      { kind: "h", text: "Camera motion: a motion blur" },
      {
        kind: "p",
        text: "Each sampled frame is blended with the frames before it, using a window of 7 frames and a decay factor of 0.65.{1} Blur across the full frame makes a moving camera visible in a single image. The prompt also tells the model that blur on static background objects probably means the camera is moving.",
        notes: ["The weights sum to 1 and rise toward the current frame. Both values give the peak camera-motion score in the appendix sweeps."],
      },
      {
        kind: "table",
        caption: "Ablation with Qwen2.5VL-7B on MotionBench. Accuracy in %; a dash means not reported.",
        head: ["Visual prompt", "Object motion", "Camera motion"],
        rows: [
          ["None (baseline)", "51.7", "34.0"],
          ["Visual spotlight", "53.0", "-"],
          ["Object crop", "52.5", "-"],
          ["Global motion blur", "50.8", "48.3"],
          ["Pose estimation", "50.6", "-"],
          ["Object motion blur", "50.2", "-"],
          ["Background blur", "49.3", "-"],
        ],
      },
      {
        kind: "p",
        text: "One row is worth a second look. Background blur lowers object-motion accuracy here, while blurred backgrounds work best for captioning in InstanceCap. The two tasks want different things: a caption needs the instance isolated from its scene, and a judgment about motion needs the scene kept as a reference. That is why the spotlight darkens the surroundings instead of blurring them.",
      },
      { kind: "h", text: "Where the gains are" },
      {
        kind: "p",
        text: "The largest gain is camera motion for Qwen2.5VL-7B on MotionBench, from 34.0 to 48.3. Overall accuracy rises for both model sizes on both benchmarks: from 53.0 to 55.6 and from 61.5 to 63.0 on MotionBench, and from 42.3 to 45.1 and from 52.8 to 53.8 on FAVOR-Bench. With InternVL3-78B, MotionSight reaches 63.0 on MotionBench, the best open-source result and ahead of the proprietary GLM-4V-Plus at 62.8. None of this requires training.",
      },
      {
        kind: "p",
        text: "We also built MotionVid-QA, a dataset of about 40K clips and 87K question and answer pairs. Fine-tuning Qwen2.5VL-7B on it raised FAVOR-Bench overall accuracy from 42.3% to 48.3%, level with Qwen2.5VL-72B at 48.1%.",
      },
    ],
    sources: [
      { label: "MotionSight on arXiv", href: "https://arxiv.org/abs/2506.01674" },
      { label: "Code", href: "https://github.com/NJU-PCALab/MotionSight" },
    ],
  },
  {
    slug: "how-a-million-clips-were-chosen",
    title: "How a million clips were chosen",
    date: "2026-11",
    summary: "The filtering pipeline behind OpenVid-1M, step by step: what was kept, what was cut, and why.",
    banner: bannerClips,
    bannerAlt: "A swarm of small ink butterflies passing through a wooden sieve, with three red butterflies on the far side.",
    accent: "#c9432f",
    blocks: [
      {
        kind: "p",
        text: "When we built OpenVid-1M, the popular text-to-video datasets had one of two problems: they were low in quality, or too large for most labs to work with. OpenVid-1M aims for a size a lab can actually use, with quality filtered at every step.",
      },
      {
        kind: "p",
        text: "The sources were ChronoMagic, CelebvHQ, Open-Sora-plan and Panda. We could only download 50M Panda videos, so we call that version Panda-50M.{1} It needed by far the heaviest filtering.",
        notes: ["Panda-70M lists 70M clips, of which 50M were available to download."],
      },
      {
        kind: "table",
        caption: "The pipeline. Steps 1 to 3 run in parallel on each source, and the rest run in sequence.",
        head: ["Step", "Tool", "Panda-50M", "Other three sources"],
        rows: [
          ["1. Aesthetics", "LAION Aesthetics Predictor", "Keep top 20%", "Keep top 90%"],
          ["2. Temporal consistency", "CLIP similarity of neighboring frames", "Drop near-static and flickering clips", "No filtering"],
          ["3. Motion", "UniMatch optical flow", "Drop highest and lowest scores", "Keep a motion subset"],
          ["4. Intersection", "None", "Keep clips passing steps 1 to 3", "Keep clips passing steps 1 and 3"],
          ["5. Clarity", "DOVER-Technical", "Keep top 30%", "Not applied"],
          ["6. Clip extraction", "Cascaded Cut Detector", "Split into single scenes", "Not applied"],
          ["7. Captioning", "LLaVA-v1.6-34b", "Recaption with longer descriptions", "Add captions to CelebvHQ"],
        ],
      },
      {
        kind: "p",
        text: "The result is 1,019,957 clips totaling 2,051 hours, averaging 7.2 seconds, all at 512×512 or higher. A subset of 433K 1080p clips forms OpenVidHD-0.4M, for work that needs high definition.{1}",
        notes: ["1920×1080, averaging 9.6 seconds per clip and about 1.2k hours in total."],
      },
      { kind: "h", text: "Why both ends of the motion scale go" },
      {
        kind: "p",
        text: "The clips with the most movement are not the best training data. Rapid motion is hard to learn from, so clips with very high optical flow are removed along with the lowest-scoring ones. Temporal consistency works the same way from both sides: very high similarity between frames means a nearly static clip, and very low similarity means flicker.",
      },
      { kind: "h", text: "How the thresholds were set" },
      {
        kind: "p",
        text: "Each threshold was calibrated by people, not picked from a formula. A group of evaluators judged samples at every step over several rounds, and the cutoffs were set where the footage they saw stopped being usable. The fixed ratios for aesthetics and clarity come from the same process. To rebuild the pipeline on new sources, repeat the calibration rather than reuse the numbers.",
      },
      {
        kind: "p",
        text: "The dataset also became the starting point for later work. InstanceVid, the 22K-video set behind InstanceCap, was selected from OpenVid-1M, and the extended OpenVid++ was accepted to IJCV in 2026.",
      },
    ],
    sources: [
      { label: "OpenVid-1M on arXiv", href: "https://arxiv.org/abs/2407.02371" },
      { label: "Code and data", href: "https://github.com/NJU-PCALab/OpenVid-1M" },
    ],
  },
  {
    slug: "how-the-posters-are-made",
    title: "How the posters on this site are made",
    date: "2026-11",
    summary:
      "Each poster is generated from a written brief under one rule: the image must perform the paper's method.",
    banner: bannerPosters,
    bannerAlt: "Eight small prints hanging from a line by clothespins; one, a fern, is tinted blue.",
    accent: "#2b45a8",
    blocks: [
      {
        kind: "p",
        text: "Every paper on this site has a poster, generated with paper2humanist-poster, a workflow I published. The look comes from prints and field drawings; the content comes from the paper.{1}",
        notes: ["The headpieces on these notes are made the same way, with Codex image generation, then cleaned to the site's paper color."],
      },
      {
        kind: "p",
        text: "The rule is “derive, don't decorate”. A poster should come from how the method works, rather than from its topic. A video dataset does not get a film strip. The workflow moves from paper to mechanism, to a physical gesture that expresses the mechanism, to a natural or handcrafted image, to a color, and only then to a prompt. It stops before generating so that a person can accept or change the idea.",
      },
      { kind: "h", text: "The constraints" },
      {
        kind: "p",
        text: "Each poster uses a single saturated color against cream, sepia or graphite, or a single controlled color field. The only text is the short name with the venue and year: no title sentence, abstract, author list or statistics. Everything, including the lettering, comes from one image generation, with no overlays added afterwards. The workflow recommends a new chat for each paper, so earlier choices do not carry over.",
      },
      {
        kind: "p",
        text: "The poster carries the idea and the paper carries the evidence. That is why every poster here sits beside its full citation, and why hovering a publication card brings up the paper's own main figure.",
      },
      { kind: "h", text: "The plates" },
      {
        kind: "plates",
        publicationIds: [
          "yang2026romerl",
          "nan2026openvidplusplus",
          "zhao2026tca",
          "du2025motionsight",
          "fan2025instancecap",
          "nan2024openvid",
          "zhao2025ultrahr",
          "fan2023effective",
        ],
      },
    ],
    sources: [{ label: "paper2humanist-poster on GitHub", href: "https://github.com/fantiehan/paper2humanist-poster" }],
  },
];
