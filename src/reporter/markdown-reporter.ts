/**
 * Markdown Reporter - Output as Markdown
 */

import type { DriftReport } from '../types/drift'
import type { ReportOptions } from './base-reporter';
import { formatDriftReport } from '../utils/format'
import { BaseReporter } from './base-reporter'

/**
 * Markdown reporter
 */
export class MarkdownReporter extends BaseReporter {
	constructor(options: ReportOptions) {
		super(options)
	}

	generate(report: DriftReport): string {
		// Filter drifts by severity
		const filteredDrifts = this.filterBySeverity(report.drifts)

		// Create filtered report
		const filteredReport: DriftReport = {
			...report,
			drifts: filteredDrifts,
			summary: {
				total: filteredDrifts.length,
				byType: this.countByType(filteredDrifts),
				bySeverity: this.countBySeverity(filteredDrifts),
				criticalCount: filteredDrifts.filter(d => d.severity === 'critical').length,
				highCount: filteredDrifts.filter(d => d.severity === 'high').length,
				mediumCount: filteredDrifts.filter(d => d.severity === 'medium').length,
				lowCount: filteredDrifts.filter(d => d.severity === 'low').length,
			},
		}

		// Use existing formatDriftReport utility
		return formatDriftReport(filteredReport)
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
