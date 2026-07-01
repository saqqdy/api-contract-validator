/**
 * Base Analyzer - Abstract base class for framework-specific analyzers
 */

import type { Framework } from '../types/config'
import type { NormalizedEndpoint } from '../types/endpoint'
import * as fs from 'node:fs'
import * as path from 'node:path'

/**
 * Analyzer base class
 * All framework-specific analyzers inherit from this
 */
export abstract class BaseAnalyzer {
	protected framework: Framework
	protected sourceDir: string
	protected files: string[] = []

	constructor(framework: Framework, sourceDir: string) {
		this.framework = framework
		this.sourceDir = sourceDir
	}

	/**
	 * Scan source directory for relevant files
	 */
	protected scanFiles(): void {
		this.files = this.findSourceFiles(this.sourceDir)
	}

	/**
	 * Find source files in directory
	 */
	protected findSourceFiles(dir: string): string[] {
		const files: string[] = []

		if (!fs.existsSync(dir)) {
			return files
		}

		const entries = fs.readdirSync(dir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name)

			if (entry.isDirectory()) {
				// Recursively scan subdirectories
				files.push(...this.findSourceFiles(fullPath))
			} else if (entry.isFile() && this.isSourceFile(entry.name)) {
				files.push(fullPath)
			}
		}

		return files
	}

	/**
	 * Check if file is a source file (TypeScript/JavaScript)
	 */
	protected isSourceFile(filename: string): boolean {
		const ext = path.extname(filename).toLowerCase()
		return ext === '.ts' || ext === '.tsx' || ext === '.js' || ext === '.jsx'
	}

	/**
	 * Read file content
	 */
	protected readFile(filePath: string): string {
		return fs.readFileSync(filePath, 'utf-8')
	}

	/**
	 * Extract endpoints from source code
	 * Must be implemented by subclasses
	 */
	abstract extractEndpoints(): NormalizedEndpoint[]

	/**
	 * Analyze and return results
	 */
	analyze(): NormalizedEndpoint[] {
		this.scanFiles()
		return this.extractEndpoints()
	}
}

/**
 * Analyzer factory function type
 */
export type AnalyzerFactory = (sourceDir: string) => BaseAnalyzer

/**
 * Analyzer registry
 */
const analyzerRegistry: Partial<Record<Framework, AnalyzerFactory>> = {}

/**
 * Register an analyzer for a framework
 */
export function registerAnalyzer(framework: Framework, factory: AnalyzerFactory): void {
	analyzerRegistry[framework] = factory
}

/**
 * Create analyzer for framework
 */
export function createAnalyzer(framework: Framework, sourceDir: string): BaseAnalyzer {
	const factory = analyzerRegistry[framework]

	if (!factory) {
		throw new Error(`No analyzer registered for framework: ${framework}`)
	}

	return factory(sourceDir)
}

/**
 * Get supported frameworks
 */
export function getSupportedFrameworks(): Framework[] {
	return Object.keys(analyzerRegistry) as Framework[]
}
