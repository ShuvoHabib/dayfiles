import { pdfFeatures, toolSlug } from './generate-pdf-seo-pack.mjs';
import { runPdfQueueGenerator } from './generators/pdf-queue-runtime.mjs';

function slugForFeature(feature) {
  return `${toolSlug(feature)}-workflow-story`;
}

function titleForFeature(feature) {
  return `${feature.name} Workflow Story: From File Chaos to Clean Delivery`;
}

function descriptionForFeature(feature) {
  return `A practical story-led guide showing how ${feature.name.toLowerCase()} fits into real deadline-driven document work without unnecessary file risk.`;
}

function tagsForFeature(feature) {
  return [toolSlug(feature), 'workflow story', 'case study', 'dayfiles'];
}

function sourcesForFeature(feature) {
  return [
    { title: 'PDF Dayfiles', url: 'https://pdf.dayfiles.com/' },
    { title: 'Dayfiles', url: 'https://dayfiles.com/' }
  ];
}

function bodyForFeature(feature) {
  return `How does ${feature.name} actually show up in real work? The story format is useful when a feature is easy to name but harder to place inside a real submission, client handoff, or team review cycle.

## A real-world scenario

Mira is working toward a deadline and needs to ${feature.taskPhrase}. The job sounds small, but the file still carries risk: the wrong version could be used, the output could fail review, or the document could create extra cleanup for the next person.

The pressure points are familiar:

- ${feature.painPoints[0]}
- ${feature.painPoints[1]}
- ${feature.painPoints[2]}

## Where the workflow breaks

The first version of the process is usually too loose. Someone opens the tool quickly, runs the feature once, and assumes the export is good enough. That is where document work starts to drift: no one confirms the critical settings, no one checks the final output, and the handoff becomes guesswork.

## What changed when the workflow became deliberate

Mira switches to a tighter sequence:

1. Start from [PDF Toolkit](/pdf-toolkit) to confirm the job category.
2. Open [PDF Dayfiles](https://pdf.dayfiles.com/) only after the source file is confirmed.
3. Review the settings that matter most: ${feature.settings.join(', ')}.
4. Export ${feature.outputLabel} and review it immediately.
5. Save the final version with a name the next reviewer can understand.

## Why this worked

The improvement did not come from using more software. It came from narrowing the workflow:

- the source input stayed clear: ${feature.inputLabel}
- the target output stayed clear: ${feature.outputLabel}
- the review step happened before the handoff, not after it

## What this format teaches better than a feature page

Story-led articles are useful because they show why ${feature.name} matters in sequence, not just in isolation. The real gain is fewer retries, clearer ownership, and a cleaner path to delivery when the file matters to someone else.

## Final takeaway

${feature.name} is not just a button. In real document work, it is one stage in a deadline-driven process. The more clearly that process is explained, the easier it is for readers to trust the article and repeat the workflow with confidence.`;
}

runPdfQueueGenerator({
  features: pdfFeatures,
  generatorName: 'pdf-story-pack',
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
