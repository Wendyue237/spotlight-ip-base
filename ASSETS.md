# 资源来源与生成说明

public/assets/approved-concept.png：用户确认的最终 Demo 图。
public/assets/entrance.jpg：用户提供 IMG_9833.JPG。
public/assets/base-tour.mp4：用户提供 IMG_9834.MOV，经 ffmpeg 转码。
public/assets/live-room.mp4：用户提供 IMG_9835.MOV，经 ffmpeg 转码。
public/assets/marble.png：内置 image_gen 生成的大理石平铺材质。
public/assets/city.png：内置 image_gen 生成的蓝调城市背景。

## 大理石生成提示词
Create a production-ready seamless square PBR base color texture for warm white / ivory marble with smoky dark gray and soft gold veins, based on an upscale Chinese office reception feature wall. Orthographic flat material scan, even diffuse illumination, no directional light, no shadows, no perspective, no objects, no text, no border. Rich natural detailed subtle stone grain, mostly warm white with occasional branching gray veins, elegant not excessive. Tileable on all edges. 1:1 square.

## 城市生成提示词
Wide 16:9 cinematic background plate for a refined 3D animated film office exploration scene. A dense contemporary Chinese city seen from a high rise at blue hour, warm amber illuminated windows in medium height residential and office towers, elegant deep navy blue atmosphere, gentle photographic bokeh and atmospheric depth, soft focus background, no dramatic landmarks, no foreground objects, no room, no people, no text, no labels, no UI. Subtle warm/cool contrast, premium realistic yet subtly animated-film rendering. Cover entire frame with city towers, relatively dark exposure to sit behind a warmly lit office diorama.

模式：内置 image_gen，未使用 CLI 回退。

## 用户提供的人物模型
- `public/assets/characters/host.glb`：来自用户提供的 `e687d038-39a2-4f08-a2b6-80ed916e6902 (1).zip`，PBR 人物，52 根骨骼，含 HumanPointingForward 动画。
- 保留原始脸型和贴图；网页运行时归一化蒙皮权重、调整到 1.9 场景单位身高。走路及非讲课互动为基础骨骼驱动动作。
