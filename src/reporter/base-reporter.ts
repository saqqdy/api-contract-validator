/**
 * Base Reporter - Abstract base class for all reporters
 */

import type { DriftReport, DriftResult } from '../types/drift'
import { writeFileSync } from 'node:fs'

/** Reporter output options */
export interface ReportOptions {
	/** Output format */
	format: 'console' | 'json' | 'markdown'
	/** Output file path (optional) */
	outputFile?: string
	/** Include suggestions in output */
	includeSuggestions?: boolean
	/** Minimal severity to include */
	minSeverity?: 'critical' | 'high' | 'medium' | 'low'
}

/**
 * Abstract base class for reporters
 */
export abstract class BaseReporter {
	protected options: ReportOptions

	constructor(options: ReportOptions) {
		this.options = options
	}

	/**
	 * Generate report output
	 */
	abstract generate(report: DriftReport): string

	/**
	 * Write report to file or stdout
	 */
	output(report: DriftReport): void {
		const content = this.generate(report)

		if (this.options.outputFile) {
			// Write to file
			writeFileSync(this.options.outputFile, content, 'utf-8')
		} else {
			// Write to stdout
			process.stdout.write(`${content  }\n`)
		}
	}

	/**
	 * Filter drifts by minimum severity
	 */
	protected filterBySeverity(drifts: DriftResult[]): DriftResult[] {
		const minSeverity = this.options.minSeverity
		if (!minSeverity) return drifts

		const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
		const minLevel = severityOrder[minSeverity]

		return drifts.filter(d => severityOrder[d.severity] <= minLevel)
	}
}
