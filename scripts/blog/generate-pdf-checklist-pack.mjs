import { pdfFeatures, toolSlug } from './generate-pdf-seo-pack.mjs';
import { runPdfQueueGenerator } from './generators/pdf-queue-runtime.mjs';

function slugForFeature(feature) {
  return `${toolSlug(feature)}-workflow-checklist`;
}

function titleForFeature(feature) {
  return `${feature.name} Workflow Checklist for Fast, Safe Delivery`;
}

function descriptionForFeature(feature) {
  return `Use this ${feature.name.toLowerCase()} checklist to prepare files, run the task, review the output, and hand off the final document with fewer mistakes.`;
}

function tagsForFeature(feature) {
  return [toolSlug(feature), 'workflow checklist', 'pdf operations', 'dayfiles'];
}

function sourcesForFeature(feature) {
  return [
    { title: 'PDF Dayfiles', url: 'https://pdf.dayfiles.com/' },
    { title: 'Dayfiles', url: 'https://dayfiles.com/' }
  ];
}

function bodyForFeature(feature) {
  const settings = feature.settings.map((item) => `- ${item}`).join('\n');
  const checks = feature.qualityChecks.map((item, index) => `${index + 1}. ${item.charAt(0).toUpperCase()}${item.slice(1)}.`).join('\n');
  const mistakes = feature.mistakes.map((item) => `- ${item.issue} Fix: ${item.fix}`).join('\n');

  return `How do you run ${feature.name} without turning a simple document task into avoidable rework? This checklist format is built for operators who want one clear sequence from preparation to final handoff.

## When to use this checklist

Use this checklist when the task is ${feature.taskPhrase}, the file matters to another reviewer, and the document should be handled with a repeatable standard instead of a one-off guess.

Common scenarios:

- ${feature.useCases[0]}
- ${feature.useCases[1]}
- ${feature.useCases[2]}

## Pre-flight setup

Before opening the live tool, confirm the job is actually ready:

1. Confirm the source input is ${feature.inputLabel}.
2. Confirm the target output is ${feature.outputLabel}.
3. Confirm the document owner and delivery destination.
4. Remove obvious drafts or duplicate source files from the working folder.

## Settings to confirm before export

These settings matter most for ${feature.name}:

${settings}

## Operator checklist

1. Start from [PDF Toolkit](/pdf-toolkit) so the broader workflow context is clear.
2. Open the live tool at [PDF Dayfiles](https://pdf.dayfiles.com/) only after the source file is confirmed.
3. Run ${feature.name} on the smallest set of files or pages needed for the job.
4. Export once with deliberate settings rather than iterating blindly.
5. Review the output before it leaves the device or team folder.

## Output review checklist

${checks}

## Common failure points

${mistakes}

## Final handoff rule

Do not treat a successful export as the end of the workflow. The job is complete only when the final file is named clearly, stored in the correct destination, and ready for the next reviewer without extra explanation.`;
}

runPdfQueueGenerator({
  features: pdfFeatures,
  generatorName: 'pdf-checklist-pack',
  slugForFeature,
  titleForFeature,
  descriptionForFeature,
  tagsForFeature,
  bodyForFeature,
  sourcesForFeature
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
