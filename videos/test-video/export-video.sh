#!/bin/bash
# Export Motion Canvas image sequence to MP4
# Usage: ./export-video.sh [output-name]

OUTPUT_NAME="${1:-hero-video}"
INPUT_DIR="output/project"
OUTPUT_FILE="${OUTPUT_NAME}.mp4"

echo "🎬 Converting image sequence to MP4..."
echo "Input: ${INPUT_DIR}/*.png"
echo "Output: ${OUTPUT_FILE}"

cd "${INPUT_DIR}" && \
ffmpeg -framerate 30 \
  -i %06d.png \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -preset ultrafast \
  -crf 23 \
  "../../${OUTPUT_FILE}" \
  -y

cd ../..

if [ -f "${OUTPUT_FILE}" ]; then
  SIZE=$(du -h "${OUTPUT_FILE}" | cut -f1)
  DURATION=$(ffprobe -v quiet -print_format json -show_format "${OUTPUT_FILE}" | grep duration | cut -d'"' -f4)
  echo ""
  echo "✅ Export complete!"
  echo "📁 File: ${OUTPUT_FILE}"
  echo "📊 Size: ${SIZE}"
  echo "⏱️  Duration: ${DURATION}s"
  echo ""

  # Clean up PNG images to save space
  echo "🧹 Cleaning up PNG images..."
  BEFORE=$(du -sh "${INPUT_DIR}" | cut -f1)
  rm -f "${INPUT_DIR}"/*.png
  AFTER=$(du -sh "${INPUT_DIR}" | cut -f1)
  echo "💾 Freed up space: ${BEFORE} → ${AFTER}"
else
  echo "❌ Export failed"
  exit 1
fi
