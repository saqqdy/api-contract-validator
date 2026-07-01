/**
 * Reporter module - Factory and exports
 */

import type { BaseReporter, ReportOptions  } from './base-reporter'
import { ConsoleReporter } from './console-reporter'
import { JsonReporter } from './json-reporter'
import { MarkdownReporter } from './markdown-reporter'

export { BaseReporter, ReportOptions } from './base-reporter'
export { ConsoleReporter } from './console-reporter'
export { JsonReporter } from './json-reporter'
export { MarkdownReporter } from './markdown-reporter'

/**
 * Create reporter by format
 */
export function createReporter(options: ReportOptions): BaseReporter {
	switch (options.format) {
		case 'console':
			return new ConsoleReporter(options)
		case 'json':
			return new JsonReporter(options)
		case 'markdown':
			return new MarkdownReporter(options)
		default:
			return new ConsoleReporter(options)
	}
}
