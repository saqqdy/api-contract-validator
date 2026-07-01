/**
 * Console Reporter - Colorful console output
 */

import type { DriftReport, DriftResult, Severity } from '../types/drift'
import type { ReportOptions } from './base-reporter';
import { BaseReporter } from './base-reporter'

// ANSI color codes
const colors = {
	reset: '\x1B[0m',
	bold: '\x1B[1m',
	red: '\x1B[31m',
	green: '\x1B[32m',
	yellow: '\x1B[33m',
	blue: '\x1B[34m',
	magenta: '\x1B[35m',
	cyan: '\x1B[36m',
	gray: '\x1B[90m',
}

// Severity colors and symbols
const severityStyles: Record<Severity, { symbol: string; color: string }> = {
	critical: { symbol: '🔴', color: colors.red },
	high: { symbol: '🔴', color: colors.red },
	medium: { symbol: '🟡', color: colors.yellow },
	low: { symbol: '🟢', color: colors.green },
}

/**
 * Console reporter with colorful output
 */
export class ConsoleReporter extends BaseReporter {
	constructor(options: ReportOptions) {
		super(options)
	}

	generate(report: DriftReport): string {
		const lines: string[] = []

		// Header
		lines.push('')
		lines.push(`${colors.bold}${colors.cyan}🔍 API Contract Drift Report${colors.reset}`)
		lines.push('')

		// Metadata
		lines.push(`${colors.gray}Generated: ${report.timestamp}${colors.reset}`)
		lines.push(`${colors.gray}Spec: ${report.specFile}${colors.reset}`)
		lines.push(`${colors.gray}Code: ${report.codeDirectory}${colors.reset}`)
		lines.push('')

		// Summary
		lines.push(`${colors.bold}Summary${colors.reset}`)
		lines.push(`${colors.gray}────────────────${colors.reset}`)
		lines.push(`  Total drifts: ${colors.bold}${report.summary.total}${colors.reset}`)

		if (report.summary.criticalCount > 0) {
			lines.push(`  ${colors.red}Critical: ${report.summary.criticalCount}${colors.reset}`)
		}
		if (report.summary.highCount > 0) {
			lines.push(`  ${colors.red}High: ${report.summary.highCount}${colors.reset}`)
		}
		if (report.summary.mediumCount > 0) {
			lines.push(`  ${colors.yellow}Medium: ${report.summary.mediumCount}${colors.reset}`)
		}
		if (report.summary.lowCount > 0) {
			lines.push(`  ${colors.green}Low: ${report.summary.lowCount}${colors.reset}`)
		}
		lines.push('')

		// Filter drifts
		const drifts = this.filterBySeverity(report.drifts)

		if (drifts.length === 0) {
			if (report.summary.total === 0) {
				lines.push(`${colors.green}✅ No drift detected!${colors.reset}`)
			} else {
				lines.push(`${colors.gray}No drifts match the severity threshold.${colors.reset}`)
			}
		} else {
			// Breaking changes (critical + high)
			const breaking = drifts.filter(d => d.severity === 'critical' || d.severity === 'high')
			if (breaking.length > 0) {
				lines.push(`${colors.bold}${colors.red}🔴 Breaking Changes${colors.reset}`)
				lines.push(`${colors.gray}────────────────${colors.reset}`)
				for (const item of breaking) {
					lines.push(this.formatDrift(item))
				}
				lines.push('')
			}

			// Warnings (medium)
			const warnings = drifts.filter(d => d.severity === 'medium')
			if (warnings.length > 0) {
				lines.push(`${colors.bold}${colors.yellow}🟡 Warnings${colors.reset}`)
				lines.push(`${colors.gray}────────────────${colors.reset}`)
				for (const item of warnings) {
					lines.push(this.formatDrift(item))
				}
				lines.push('')
			}

			// Info (low)
			const info = drifts.filter(d => d.severity === 'low')
			if (info.length > 0) {
				lines.push(`${colors.bold}${colors.green}🟢 Info${colors.reset}`)
				lines.push(`${colors.gray}────────────────${colors.reset}`)
				for (const item of info) {
					lines.push(this.formatDrift(item))
				}
				lines.push('')
			}
		}

		return lines.join('\n')
	}

	/**
	 * Format a single drift item
	 */
	private formatDrift(item: DriftResult): string {
		const style = severityStyles[item.severity]
		const type = item.type.replace(/-/g, ' ')
		const methodPath = `${item.method.toUpperCase()} ${item.path}`

		let line = `  ${style.symbol} ${colors.bold}[${type}]${colors.reset} ${methodPath}`

		// Add message
		if (item.details.fieldName) {
			line += ` — field "${item.details.fieldName}"`
		}

		// Add location
		if (item.location) {
			const loc = item.location.code?.path || item.location.spec?.path
			if (loc) {
				line += ` ${colors.gray}(${loc})${colors.reset}`
			}
		}

		return line
	}
}
