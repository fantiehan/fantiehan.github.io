import type { Note } from "@/content/types";

export const notes: Note[] = [
  {
    slug: "what-a-video-caption-has-to-carry",
    title: "What a video caption has to carry",
    date: "2026-11",
    summary:
      "Text-to-video models learn from captions, so vague captions cost quality. What InstanceCap changed, what improved, and what did not.",
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
        text: "InstanceCap prepares the video before the LLM sees it. A detector finds each instance, SAM2 segments it across the clip, and everything outside it is blurred. The LLM then describes that one instance. We compared this with red circles, bounding boxes, grayscale backgrounds and solid-color masks. Circles, boxes and grayscale still let attributes blend across instances, and solid color often pushed the LLM to add wrong context. That comparison in the paper is qualitative, based on reconstructed examples.",
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
        text: "Caption quality is hard to score directly, so we fed captions for 100 clips into CogVideoX-5b and compared each generated video with the original. A lower 3DVAE score means the two are closer.",
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
        text: "Length alone does not explain the ranking: InstanceCap beats the longest captions in this table while using about 40% fewer words. It is not first on every measure, since MiraData scores slightly higher on sentence-level CLIP similarity.",
      },
      {
        kind: "p",
        text: "The test closer to real use was training. We fine-tuned Open-Sora v1.2 on InstanceVid, a 22K-video dataset selected from OpenVid-1M and captioned this way, then ran more than 200 instance-focused checks. The average success rate rose from 28.63% to 37.88%. The largest gains were single action (40% to 56%), multiple color (16% to 32%) and single detail (13% to 27%).",
      },
      { kind: "h", text: "What is still unsolved" },
      {
        kind: "p",
        text: "A success rate of 37.88% is an improvement, not a solved problem. CogVideoX-5B, tested for comparison, averaged 43.00%. Prompts with multiple shapes or multiple details went badly enough for every tested model that we left them out of the results table. There is also a mismatch at inference: models trained on long captions perform poorly on short prompts, which is why the paper adds InstanceEnhancer to rewrite user prompts into the training format.",
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
      "MotionSight improves motion understanding without any training by changing what the model sees. Camera motion gains the most; other categories gain less.",
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
        text: "The LLM names the objects relevant to the question. GroundingDINO locates them in a key frame, SAM2 tracks them, and a temporal aggregator smooths out box jitter. Everything outside the boxes is then darkened, with a darken factor of 0.9, while the objects stay in place at full brightness.",
      },
      { kind: "h", text: "Camera motion: a motion blur" },
      {
        kind: "p",
        text: "Each sampled frame is blended with the frames before it, using a window of 7 frames and a decay factor of 0.65. Blur across the full frame makes a moving camera visible in a single image. The prompt also tells the model that blur on static background objects probably means the camera is moving.",
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
        text: "One row is worth a second look. Background blur lowers object-motion accuracy here, yet blurred backgrounds worked best in InstanceCap. The tasks and models differ, so the two results are not directly comparable. One plausible reason is that a caption needs isolation while motion is judged against surroundings, but the paper does not test that explanation.",
      },
      { kind: "h", text: "Where the gains are" },
      {
        kind: "p",
        text: "The result that stands out is camera motion for Qwen2.5VL-7B on MotionBench, from 34.0 to 48.3. Overall gains are more modest: 53.0 to 55.6 for that model on MotionBench and 61.5 to 63.0 for InternVL3-78B. On FAVOR-Bench the overall figures move from 42.3 to 45.1 and from 52.8 to 53.8. A method with no training cost can add a few points, but it does not close the gap on its own.",
      },
      {
        kind: "p",
        text: "We also built MotionVid-QA, a dataset of about 40K clips and 87K question and answer pairs. Fine-tuning Qwen2.5VL-7B on it raised FAVOR-Bench overall accuracy from 42.3% to 48.3%.",
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
    summary: "The filtering pipeline behind OpenVid-1M, step by step, including what the paper does not pin down with numbers.",
    blocks: [
      {
        kind: "p",
        text: "When we built OpenVid-1M, the popular text-to-video datasets had one of two problems: they were low in quality, or too large for most labs to work with. OpenVid-1M aims for a size a lab can actually use, with quality filtered at every step.",
      },
      {
        kind: "p",
        text: "The sources were ChronoMagic, CelebvHQ, Open-Sora-plan and Panda. We could only download 50M Panda videos, so we call that version Panda-50M. It needed by far the heaviest filtering.",
      },
      {
        kind: "table",
        caption: "The pipeline. Steps 1 to 3 run in parallel on each source, and the rest run in sequence.",
        head: ["Step", "Tool", "Panda-50M", "Other three sources"],
        rows: [
          ["1. Aesthetics", "LAION Aesthetics Predictor", "Keep top 20%", "Keep top 90%"],
          ["2. Temporal consistency", "CLIP similarity of neighboring frames", "Drop near-static and flickering clips", "No filtering"],
          ["3. Motion", "UniMatch optical flow", "Drop highest and lowest scores", "Motion subset, no stated cutoff"],
          ["4. Intersection", "None", "Keep clips passing steps 1 to 3", "Keep clips passing steps 1 and 3"],
          ["5. Clarity", "DOVER-Technical", "Keep top 30%", "Not applied"],
          ["6. Clip extraction", "Cascaded Cut Detector", "Split into single scenes", "Not applied"],
          ["7. Captioning", "LLaVA-v1.6-34b", "Recaption with longer descriptions", "Add captions to CelebvHQ"],
        ],
      },
      {
        kind: "p",
        text: "The result is 1,019,957 clips totaling 2,051 hours, averaging 7.2 seconds, all at 512×512 or higher. A subset of 433K 1080p clips forms OpenVidHD-0.4M, for work that needs high definition.",
      },
      { kind: "h", text: "Why both ends of the motion scale go" },
      {
        kind: "p",
        text: "It would be natural to keep the clips with the most movement, but the paper treats rapid motion as unsuitable for training. Clips with very high optical flow are removed along with the lowest-scoring ones. Temporal consistency works the same way from both sides: very high similarity between frames means a nearly static clip, and very low similarity means flicker.",
      },
      { kind: "h", text: "What the numbers do not tell you" },
      {
        kind: "p",
        text: "Some thresholds are explicit and some are not. The aesthetics and clarity ratios are stated above, but the temporal and motion steps have no numeric cutoffs in the paper. Thresholds and ratios came from a group of evaluators judging samples over several rounds. Anyone rebuilding the pipeline should expect to repeat that calibration rather than copy a fixed value.",
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
      "The posters are AI-generated from a written brief, not drawn by hand. The rule behind them: the image must perform the paper's method.",
    blocks: [
      {
        kind: "p",
        text: "Every paper on this site has a poster. The posters are AI-generated, using a workflow I published as paper2humanist-poster. They look like prints and field drawings, but no one drew them by hand, and I would rather say so plainly.",
      },
      {
        kind: "p",
        text: "The rule is “derive, don't decorate”. A poster should come from how the method works, rather than from its topic. A video dataset does not get a film strip. The workflow moves from paper to mechanism, to a physical gesture that expresses the mechanism, to a natural or handcrafted image, to a color, and only then to a prompt. It stops before generating so that a person can accept or change the idea.",
      },
      {
        kind: "plates",
        items: [
          { publicationId: "fan2025instancecap", text: "InstanceCap describes one instance at a time. Three specimens are drawn sharply while the field behind them fades." },
          { publicationId: "du2025motionsight", text: "MotionSight separates object motion from camera motion. One butterfly's path, in color, crosses reeds bent by wind." },
          { publicationId: "nan2024openvid", text: "OpenVid-1M filters a huge source down to a usable set. A mass of printed butterflies narrows to a few solid ones." },
          { publicationId: "zhao2026tca", text: "TCA-Captioner aligns audio and video over time. Two lines of music are tied together at three points." },
          { publicationId: "yang2026romerl", text: "RoMeRL keeps agent memory in a fixed number of states. Bees bring in a whole meadow, and it fits in a small frame of cells." },
        ],
      },
      { kind: "h", text: "The constraints" },
      {
        kind: "p",
        text: "Each poster uses a single saturated color against cream, sepia or graphite, or a single controlled color field. The only text is the short name with the venue and year: no title sentence, abstract, author list or statistics. Everything, including the lettering, comes from one image generation, with no overlays added afterwards. The workflow recommends a new chat for each paper, so earlier choices do not carry over.",
      },
      {
        kind: "p",
        text: "A poster is not a substitute for the paper. It cannot show a result or a limitation, and a metaphor can flatter a method. That is why every poster on this site sits beside its full citation and can be switched to the paper's own main figure. The poster is there to help you remember the idea, and the paper is the thing to check.",
      },
    ],
    sources: [{ label: "paper2humanist-poster on GitHub", href: "https://github.com/fantiehan/paper2humanist-poster" }],
  },
];
