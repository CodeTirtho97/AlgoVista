import { ProgrammingLanguage } from '../models';
import { VM } from 'vm2';
import * as parser from '@babel/parser';
import algorithmExecutionService from './AlgorithmExecutionService';

export interface CodeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
  operationsCount?: number;
}

export class CodeEvaluationService {
  /**
   * Validate code syntax and structure
   */
  public validateCode(code: string, language: ProgrammingLanguage): CodeValidationResult {
    const result: CodeValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    try {
      switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
          this.validateJavaScript(code, result);
          break;
        case ProgrammingLanguage.PYTHON:
          this.validatePython(code, result);
          break;
        case ProgrammingLanguage.JAVA:
          this.validateJava(code, result);
          break;
        case ProgrammingLanguage.CPP:
          this.validateCpp(code, result);
          break;
        default:
          result.warnings.push(`Validation for ${language} is limited. Basic syntax checks only.`);
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }
  
  /**
   * Validate JavaScript code
   */
  private validateJavaScript(code: string, result: CodeValidationResult): void {
    try {
      // Parse the code to check for syntax errors
      parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
      
      // Check for execute function existence
      if (!code.includes('function execute(') && !code.includes('const execute =') && !code.includes('let execute =')) {
        result.warnings.push('No "execute" function found. Make sure your code exports a function named "execute".');
      }
      
      // Check for infinite loops patterns
      if ((code.includes('while (true)') || code.includes('while(true)')) && !code.includes('break')) {
        result.warnings.push('Possible infinite loop detected. Make sure your loops have proper exit conditions.');
      }
      
      // Additional security checks
      const dangerousPatterns = [
        'process.exit',
        'require(',
        'eval(',
        'Function(',
        'setTimeout(',
        'setInterval('
      ];
      
      for (const pattern of dangerousPatterns) {
        if (code.includes(pattern)) {
          result.warnings.push(`Potentially unsafe code pattern detected: ${pattern}`);
        }
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(`JavaScript syntax error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Validate Python code
   */
  private validatePython(code: string, result: CodeValidationResult): void {
    try {
      // Basic Python syntax validation using string patterns
      
      // Check for execute function existence
      if (!code.includes('def execute(') && !code.includes('def execute (')) {
        result.warnings.push('No "execute" function found. Make sure your code defines a function named "execute".');
      }
      
      // Check for infinite loops patterns
      if (code.includes('while True:') && !code.includes('break')) {
        result.warnings.push('Possible infinite loop detected. Make sure your loops have proper exit conditions.');
      }
      
      // Check for matching parentheses, brackets, and braces
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        result.isValid = false;
        result.errors.push('Python syntax error: Mismatched parentheses');
      }
      
      const openBrackets = (code.match(/\[/g) || []).length;
      const closeBrackets = (code.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        result.isValid = false;
        result.errors.push('Python syntax error: Mismatched brackets');
      }
      
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        result.isValid = false;
        result.errors.push('Python syntax error: Mismatched braces');
      }
      
      // Additional security checks
      const dangerousPatterns = [
        'import os',
        'import sys',
        'import subprocess',
        'eval(',
        'exec(',
        '__import__',
        'globals()',
        'locals()'
      ];
      
      for (const pattern of dangerousPatterns) {
        if (code.includes(pattern)) {
          result.warnings.push(`Potentially unsafe code pattern detected: ${pattern}`);
        }
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push(`Python syntax error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Validate Java code (basic checks only)
   */
  private validateJava(code: string, result: CodeValidationResult): void {
    // Basic pattern checks for Java
    if (!code.includes('public static') && !code.includes('class')) {
      result.warnings.push('Code does not appear to define a proper Java class.');
    }
    
    if (!code.includes('execute(') || !code.includes('public static')) {
      result.warnings.push('No "execute" method found. Make sure your code has a public static execute method.');
    }
    
    // Check for infinite loops patterns
    if (code.includes('while (true)') && !code.includes('break')) {
      result.warnings.push('Possible infinite loop detected. Make sure your loops have proper exit conditions.');
    }
    
    // Additional security checks
    const dangerousPatterns = [
      'System.exit',
      'Runtime.getRuntime',
      'ProcessBuilder',
      'reflection.'
    ];
    
    for (const pattern of dangerousPatterns) {
      if (code.includes(pattern)) {
        result.warnings.push(`Potentially unsafe code pattern detected: ${pattern}`);
      }
    }
  }
  
  /**
   * Validate C++ code (basic checks only)
   */
  private validateCpp(code: string, result: CodeValidationResult): void {
    // Basic pattern checks for C++
    if (!code.includes('execute(') && !code.includes('void execute') && !code.includes('int execute')) {
      result.warnings.push('No "execute" function found. Make sure your code has an execute function.');
    }
    
    // Check for infinite loops patterns
    if ((code.includes('while (true)') || code.includes('while(true)')) && !code.includes('break')) {
      result.warnings.push('Possible infinite loop detected. Make sure your loops have proper exit conditions.');
    }
    
    // Additional security checks
    const dangerousPatterns = [
      'system(',
      'exec(',
      'popen(',
      'fork(',
      'std::system'
    ];
    
    for (const pattern of dangerousPatterns) {
      if (code.includes(pattern)) {
        result.warnings.push(`Potentially unsafe code pattern detected: ${pattern}`);
      }
    }
  }
  
  /**
   * Execute JavaScript code safely in a sandbox
   */
  public executeJavaScriptSandbox(code: string, input: any): CodeExecutionResult {
    const startTime = process.hrtime();
    let operationsCount = 0;
    
    try {
      // Create instrumented code to count operations
      const instrumentedCode = this.instrumentJavaScriptCode(code);
      
      // Create a sandbox VM
      const vm = new VM({
        timeout: 5000, // 5 seconds timeout
        sandbox: {
          input: JSON.parse(JSON.stringify(input)), // Deep clone to prevent modifications
          console: {
            log: (output: any) => output,
            error: (output: any) => output
          },
          _operationsCounter: 0
        }
      });
      
      // Execute the code
      const wrappedCode = `
        ${instrumentedCode}
        
        // Execute function with input
        const result = execute(input);
        
        // Return result and operation count
        ({ result, operationsCount: _operationsCounter })
      `;
      
      const result = vm.run(wrappedCode);
      
      // Calculate execution time
      const endTime = process.hrtime(startTime);
      const executionTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
      
      // Get memory usage
      const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Convert to MB
      
      return {
        success: true,
        output: JSON.stringify(result.result),
        executionTime,
        memoryUsage,
        operationsCount: result.operationsCount
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Instrument JavaScript code to count operations
   */
  private instrumentJavaScriptCode(code: string): string {
    // This is a simplified version of instrumentation
    // In a real implementation, you'd use an AST parser to add operation counters
    
    // Replace common operations with instrumented versions
    return code
      .replace(/for\s*\(/g, '_operationsCounter++; for (')
      .replace(/while\s*\(/g, '_operationsCounter++; while (')
      .replace(/if\s*\(/g, '_operationsCounter++; if (')
      .replace(/(\w+)\s*[+\-*/%]=\s*(\w+)/g, '$1 = $1 $2; _operationsCounter++')
      .replace(/(\w+)\s*=\s*(\w+)\s*([+\-*/%])\s*(\w+)/g, '$1 = $2 $3 $4; _operationsCounter++');
  }
  
  /**
   * Execute code using the algorithm execution service
   */
  public async executeCode(
    code: string,
    input: any,
    language: ProgrammingLanguage
  ): Promise<CodeExecutionResult> {
    try {
      // For JavaScript, we can use the sandbox execution
      if (language === ProgrammingLanguage.JAVASCRIPT) {
        return this.executeJavaScriptSandbox(code, input);
      }
      
      // For other languages, use the algorithm execution service
      const executionResult = await algorithmExecutionService.executeAlgorithm(
        language,
        code,
        JSON.stringify(input)
      );
      
      if (executionResult.error) {
        return {
          success: false,
          error: executionResult.error
        };
      }
      
      return {
        success: true,
        output: executionResult.result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Compare results from multiple algorithm implementations
   */
  public async compareAlgorithms(
    algorithms: Array<{
      code: string;
      language: ProgrammingLanguage;
      name: string;
    }>,
    input: any
  ): Promise<Array<CodeExecutionResult & { name: string }>> {
    const results = [];
    
    for (const algorithm of algorithms) {
      const startTime = process.hrtime();
      
      // Execute the algorithm
      const executionResult = await this.executeCode(
        algorithm.code,
        input,
        algorithm.language
      );
      
      // Calculate execution time
      const endTime = process.hrtime(startTime);
      const executionTime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
      
      results.push({
        ...executionResult,
        name: algorithm.name,
        executionTime: executionResult.executionTime || executionTime
      });
    }
    
    // Sort results by execution time
    return results.sort((a, b) => (a.executionTime || 0) - (b.executionTime || 0));
  }
}

// Export singleton instance
const codeEvaluationService = new CodeEvaluationService();
export default codeEvaluationService;