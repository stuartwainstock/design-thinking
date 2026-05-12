import { phaseDocument } from './documents/phase'
import { tagDocument } from './documents/tag'
import { frameworkDocument } from './documents/framework'
import { processDocument } from './documents/process'
import { insightDocument } from './documents/insight'
import { principleDocument } from './documents/principle'
import { externalResourceDocument } from './documents/externalResource'
import { stepObject } from './objects/step'

export const schemaTypes = [
  // Taxonomy (define first — referenced by document types)
  phaseDocument,
  tagDocument,

  // Inline objects
  stepObject,

  // Core knowledge document types
  frameworkDocument,
  processDocument,
  insightDocument,
  principleDocument,
  externalResourceDocument,
]
