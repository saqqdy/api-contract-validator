/**
 * Formatting utility functions
 */

import type { DriftReport, DriftResult, NormalizedEndpoint, Severity } from '../types'

/** Map internal severity to display severity */
type DisplaySeverity = 'breaking' | 'warning' | 'info'

function mapSeverity(severity: Severity): DisplaySeverity {
	const map: Record<Severity, DisplaySeverity> = {
		critical: 'breaking',
		high: 'breaking',
		medium: 'warning',
		low: 'info',
	}
	return map[severity]
}

/** Format a DriftResult as Markdown */
export function formatDriftItem(item: DriftResult): string {
	const displaySeverity = mapSeverity(item.severity)
	const severity =
		displaySeverity === 'breaking' ? '🔴' : displaySeverity === 'warning' ? '🟡' : '🟢'
	const type = item.type.replace('-', ' ')
	return `- ${severity} **${type}**: ${item.message}`
}

/** Format an endpoint as short string */
export function formatEndpointShort(endpoint: NormalizedEndpoint): string {
	return `${endpoint.method.toUpperCase()} ${endpoint.path}`
}

/** Format a full DriftReport as Markdown */
export function formatDriftReport(report: DriftReport): string {
	const lines: string[] = []

	lines.push('# API Contract Drift Report')
	lines.push('')
	lines.push(`**Generated**: ${report.timestamp}`)
	lines.push(`**Spec**: ${report.specFile}`)
	lines.push(`**Code**: ${report.codeDirectory}`)
	lines.push('')

	// Summary
	lines.push('## Summary')
	lines.push('')
	lines.push(`- **Total drifts**: ${report.summary.total}`)
	lines.push(`- **Critical**: ${report.summary.criticalCount}`)
	lines.push(`- **High**: ${report.summary.highCount}`)
	lines.push(`- **Medium**: ${report.summary.mediumCount}`)
	lines.push(`- **Low**: ${report.summary.lowCount}`)
	lines.push('')

	// Breaking changes (critical + high)
	const breaking = report.drifts.filter(d => d.severity === 'critical' || d.severity === 'high')
	if (breaking.length > 0) {
		lines.push('## 🔴 Breaking Changes')
		lines.push('')
		for (const item of breaking) {
			lines.push(formatDriftItem(item))
			if (item.location) {
				const loc = item.location.spec?.path || item.location.code?.path
				if (loc) lines.push(`  - Location: ${loc}`)
			}
		}
		lines.push('')
	}

	// Warnings (medium)
	const warnings = report.drifts.filter(d => d.severity === 'medium')
	if (warnings.length > 0) {
		lines.push('## 🟡 Warnings')
		lines.push('')
		for (const item of warnings) {
			lines.push(formatDriftItem(item))
		}
		lines.push('')
	}

	// Info (low)
	const info = report.drifts.filter(d => d.severity === 'low')
	if (info.length > 0) {
		lines.push('## 🟢 Info')
		lines.push('')
		for (const item of info) {
			lines.push(formatDriftItem(item))
		}
		lines.push('')
	}

	return lines.join('\n')
}

/** Format severity badge */
export function formatSeverityBadge(severity: DisplaySeverity): string {
	return severity === 'breaking'
		? '[!BREAKING]'
		: severity === 'warning'
			? '[!WARNING]'
			: '[INFO]'
}

/** Truncate a string to maxLen, adding ellipsis if needed */
export function truncate(str: string, maxLen: number): string {
	if (str.length <= maxLen) return str
	return `${str.slice(0, maxLen - 1)}…`
}
