/**
 * JSON Reporter - Output as JSON
 */

import type { DriftReport } from '../types/drift'
import type { ReportOptions } from './base-reporter';
import { BaseReporter } from './base-reporter'

/**
 * JSON reporter
 */
export class JsonReporter extends BaseReporter {
	constructor(options: ReportOptions) {
		super(options)
	}

	generate(report: DriftReport): string {
		// Filter drifts by severity
		const filteredDrifts = this.filterBySeverity(report.drifts)

		// Create filtered report
		const outputReport = {
			version: report.version,
			timestamp: report.timestamp,
			specFile: report.specFile,
			codeDirectory: report.codeDirectory,
			summary: {
				total: filteredDrifts.length,
				byType: this.countByType(filteredDrifts),
				bySeverity: this.countBySeverity(filteredDrifts),
				criticalCount: filteredDrifts.filter(d => d.severity === 'critical').length,
				highCount: filteredDrifts.filter(d => d.severity === 'high').length,
				mediumCount: filteredDrifts.filter(d => d.severity === 'medium').length,
				lowCount: filteredDrifts.filter(d => d.severity === 'low').length,
			},
			drifts: filteredDrifts.map(d => ({
				type: d.type,
				severity: d.severity,
				method: d.method,
				path: d.path,
				message: d.message,
				location: d.location,
				suggestions: this.options.includeSuggestions ? d.suggestions : undefined,
			})),
		}

		return JSON.stringify(outputReport, null, 2)
	}

	private countByType(drifts: DriftReport['drifts']): Record<string, number> {
		const counts: Record<string, number> = {}
		for (const d of drifts) {
			counts[d.type] = (counts[d.type] || 0) + 1
		}
		return counts
	}

	private countBySeverity(drifts: DriftReport['drifts']): Record<string, number> {
		const counts: Record<string, number> = {}
		for (const d of drifts) {
			counts[d.severity] = (counts[d.severity] || 0) + 1
		}
		return counts
	}
}
