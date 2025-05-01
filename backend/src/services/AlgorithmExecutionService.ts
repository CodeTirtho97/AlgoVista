import { ProgrammingLanguage } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { Server as SocketIOServer } from 'socket.io';

const execPromise = util.promisify(exec);

export class AlgorithmExecutionService {
  private io?: SocketIOServer;
  private tempDir: string;
  private executionTimeouts: Map<string, NodeJS.Timeout>;
  
  constructor(io?: SocketIOServer) {
    this.io = io;
    this.tempDir = path.join(process.cwd(), 'temp');
    this.executionTimeouts = new Map();
    this.initializeTempDirectory();
  }
  
  /**
   * Initialize temporary directory for code execution
   */
  private async initializeTempDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }
  
  /**
   * Execute algorithm code
   */
  public async executeAlgorithm(
    language: ProgrammingLanguage,
    code: string,
    input: string
  ): Promise<{ executionId: string; result?: string; error?: string }> {
    const executionId = uuidv4();
    const timestamp = Date.now();
    
    try {
      // Create execution directory
      const executionDir = path.join(this.tempDir, executionId);
      await fs.mkdir(executionDir, { recursive: true });
      
      // Emit start event if Socket.IO is available
      if (this.io) {
        this.io.emit(`algorithm-execution-${executionId}`, {
          status: 'started',
          executionId,
          timestamp
        });
      }
      
      // Execute code based on language
      let result: string;
      
      switch (language) {
        case ProgrammingLanguage.JAVASCRIPT:
          result = await this.executeJavaScript(executionId, code, input);
          break;
        case ProgrammingLanguage.PYTHON:
          result = await this.executePython(executionId, code, input);
          break;
        case ProgrammingLanguage.JAVA:
          result = await this.executeJava(executionId, code, input);
          break;
        case ProgrammingLanguage.CPP:
          result = await this.executeCpp(executionId, code, input);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      
      // Emit completion event
      if (this.io) {
        this.io.emit(`algorithm-execution-${executionId}`, {
          status: 'completed',
          executionId,
          result,
          timestamp: Date.now()
        });
      }
      
      // Schedule cleanup
      this.scheduleCleanup(executionId, executionDir);
      
      return {
        executionId,
        result
      };
    } catch (error) {
      // Handle execution error
      const errorMessage = error instanceof Error ? error.message : 'Execution failed';
      
      // Emit error event
      if (this.io) {
        this.io.emit(`algorithm-execution-${executionId}`, {
          status: 'error',
          executionId,
          error: errorMessage,
          timestamp: Date.now()
        });
      }
      
      return {
        executionId,
        error: errorMessage
      };
    }
  }
  
  /**
   * Execute JavaScript code
   */
  private async executeJavaScript(
    executionId: string,
    code: string,
    input: string
  ): Promise<string> {
    const executionDir = path.join(this.tempDir, executionId);
    const codePath = path.join(executionDir, 'algorithm.js');
    const inputPath = path.join(executionDir, 'input.json');
    
    // Wrap code in a function and add input handling
    const wrappedCode = `
      const input = JSON.parse(require('fs').readFileSync('./input.json', 'utf8'));
      
      ${code}
      
      // Assuming the main function is called 'execute'
      const result = execute(input);
      console.log(JSON.stringify(result));
    `;
    
    // Write code and input to files
    await fs.writeFile(codePath, wrappedCode);
    await fs.writeFile(inputPath, JSON.stringify(input));
    
    // Execute with Node.js
    const { stdout, stderr } = await execPromise(
      `cd ${executionDir} && node algorithm.js`,
      { timeout: 5000 }
    );
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout.trim();
  }
  
  /**
   * Execute Python code
   */
  private async executePython(
    executionId: string,
    code: string,
    input: string
  ): Promise<string> {
    const executionDir = path.join(this.tempDir, executionId);
    const codePath = path.join(executionDir, 'algorithm.py');
    const inputPath = path.join(executionDir, 'input.json');
    
    // Wrap code and add input handling
    const wrappedCode = `
import json
import sys

# Load input data
with open('input.json', 'r') as f:
    input_data = json.load(f)

${code}

# Assuming the main function is called 'execute'
result = execute(input_data)
print(json.dumps(result))
    `;
    
    // Write code and input to files
    await fs.writeFile(codePath, wrappedCode);
    await fs.writeFile(inputPath, JSON.stringify(input));
    
    // Execute with Python
    const { stdout, stderr } = await execPromise(
      `cd ${executionDir} && python algorithm.py`,
      { timeout: 5000 }
    );
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout.trim();
  }
  
  /**
   * Execute Java code
   */
  private async executeJava(
    executionId: string,
    code: string,
    input: string
  ): Promise<string> {
    const executionDir = path.join(this.tempDir, executionId);
    const codePath = path.join(executionDir, 'Algorithm.java');
    const inputPath = path.join(executionDir, 'input.json');
    
    // Wrap code in a class with main method
    const wrappedCode = `
import java.io.FileReader;
import java.io.BufferedReader;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class Algorithm {
    ${code}
    
    public static void main(String[] args) {
        try {
            JSONParser parser = new JSONParser();
            JSONObject inputData = (JSONObject) parser.parse(new FileReader("input.json"));
            
            // Assuming the main function is called 'execute'
            Object result = execute(inputData);
            System.out.println(result.toString());
        } catch (Exception e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }
}
    `;
    
    // Write code and input to files
    await fs.writeFile(codePath, wrappedCode);
    await fs.writeFile(inputPath, JSON.stringify(input));
    
    // Compile and execute Java code
    await execPromise(`cd ${executionDir} && javac Algorithm.java`, { timeout: 5000 });
    
    const { stdout, stderr } = await execPromise(
      `cd ${executionDir} && java Algorithm`,
      { timeout: 5000 }
    );
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout.trim();
  }
  
  /**
   * Execute C++ code
   */
  private async executeCpp(
    executionId: string,
    code: string,
    input: string
  ): Promise<string> {
    const executionDir = path.join(this.tempDir, executionId);
    const codePath = path.join(executionDir, 'algorithm.cpp');
    const inputPath = path.join(executionDir, 'input.txt');
    
    // Wrap code with main function
    const wrappedCode = `
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

${code}

// Main function to handle input/output
int main() {
    // Read input from file
    std::ifstream input_file("input.txt");
    std::string input_data((std::istreambuf_iterator<char>(input_file)),
                           std::istreambuf_iterator<char>());
    
    // Parse JSON input
    json input = json::parse(input_data);
    
    // Execute algorithm (assuming the main function is called 'execute')
    json result = execute(input);
    
    // Output result
    std::cout << result.dump() << std::endl;
    
    return 0;
}
    `;
    
    // Write code and input to files
    await fs.writeFile(codePath, wrappedCode);
    await fs.writeFile(inputPath, input);
    
    // Compile and execute C++ code
    await execPromise(
      `cd ${executionDir} && g++ -std=c++17 algorithm.cpp -o algorithm`,
      { timeout: 10000 }
    );
    
    const { stdout, stderr } = await execPromise(
      `cd ${executionDir} && ./algorithm`,
      { timeout: 5000 }
    );
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout.trim();
  }
  
  /**
   * Schedule cleanup of execution directory
   */
  private scheduleCleanup(executionId: string, executionDir: string): void {
    const timeout = setTimeout(async () => {
      try {
        await fs.rm(executionDir, { recursive: true, force: true });
        this.executionTimeouts.delete(executionId);
      } catch (error) {
        console.error(`Failed to clean up execution directory ${executionDir}:`, error);
      }
    }, 60 * 60 * 1000); // Clean up after 1 hour
    
    this.executionTimeouts.set(executionId, timeout);
  }
  
  /**
   * Cancel execution
   */
  public cancelExecution(executionId: string): void {
    const timeout = this.executionTimeouts.get(executionId);
    
    if (timeout) {
      clearTimeout(timeout);
      this.executionTimeouts.delete(executionId);
    }
    
    // Clean up execution directory
    const executionDir = path.join(this.tempDir, executionId);
    fs.rm(executionDir, { recursive: true, force: true })
      .catch(error => console.error(`Failed to clean up execution directory ${executionDir}:`, error));
    
    // Emit cancellation event
    if (this.io) {
      this.io.emit(`algorithm-execution-${executionId}`, {
        status: 'cancelled',
        executionId,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Clean up all resources
   */
  public cleanup(): void {
    // Clear all timeouts
    for (const [executionId, timeout] of this.executionTimeouts.entries()) {
      clearTimeout(timeout);
      this.executionTimeouts.delete(executionId);
    }
    
    // Clean up temp directory
    fs.rm(this.tempDir, { recursive: true, force: true })
      .catch(error => console.error(`Failed to clean up temp directory ${this.tempDir}:`, error));
  }
}

// Export singleton instance
const algorithmExecutionService = new AlgorithmExecutionService();
export default algorithmExecutionService;