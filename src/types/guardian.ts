/**
 * Guardian Types - Structured JSON Output
 *
 * Type definitions for Guardian's code review results
 */

/**
 * A single violation found by Guardian
 */
export interface Violation {
  /** Pattern or rule that was violated (e.g., "Pattern 1: Placeholder Syntax") */
  pattern: string;

  /** Optional line number where violation occurs */
  line?: number;

  /** Description of what's wrong */
  issue: string;

  /** Recommendation for how to fix it */
  recommendation: string;

  /** Severity level */
  severity: 'minor' | 'major';

  /** Confidence score (0-1 scale) indicating certainty about this violation */
  confidence?: number;
}

/**
 * Guardian's structured review result
 */
export interface GuardianResult {
  /** Overall assessment summary */
  summary: {
    /** Overall status of the code review */
    status: 'compliant' | 'minor_issues' | 'major_violations';

    /** Brief message summarizing the assessment */
    message: string;
  };

  /** List of violations found (empty if compliant) */
  violations: Violation[];

  /** List of positive observations about the code */
  positiveObservations: string[];
}
