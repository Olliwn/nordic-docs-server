Testing the Nordic Documentation MCP Server
Here are step-by-step instructions for testing your newly created Nordic documentation MCP server with some simple "hello world" style test cases.

Prerequisites
The MCP server has been built and configured (which we've already done)
Your Perplexity API key is properly set in the configuration
Cline is running and can access the MCP server
Test Case 1: Basic Documentation Query
This test verifies that the server can retrieve basic documentation information.

Steps:
Open Cline and start a new conversation
Ask Cline: "Using the Nordic documentation server, can you explain what nRF Connect SDK is?"
Cline should use the search_nordic_docs tool with a query about nRF Connect SDK
You should receive a response with information about the nRF Connect SDK from Nordic's documentation
Test Case 2: API Function Reference
This test checks if the server can retrieve specific API function details.

Steps:
In Cline, ask: "Using the Nordic documentation server, show me how to use the sd_ble_gap_adv_start function"
Cline should use the search_nordic_docs tool with a query about this specific function
You should receive a response containing:
Function signature
Parameter descriptions
Return value information
Example usage code
Test Case 3: Code Example Request
This test verifies the server can retrieve code examples.

Steps:
In Cline, ask: "Using the Nordic documentation server, show me a simple BLE peripheral example for nRF52"
Cline should use the search_nordic_docs tool with a query about BLE peripheral examples
You should receive a response containing code examples with explanations
Test Case 4: SDK Version Specific Query
This test checks if the server can target specific SDK versions.

Steps:
In Cline, ask: "Using the Nordic documentation server, explain how to use PWM in nRF5 SDK v17.0.0"
Cline should use the search_nordic_docs tool with the query and SDK version parameter
You should receive information specific to that SDK version
Test Case 5: Direct Tool Usage
This test demonstrates how to directly use the tool with specific parameters.

Steps:
In Cline, ask: "Please use the nordic-docs MCP server tool with these parameters: query='How to implement BLE UART service', sdk_version='nRF Connect SDK v2.0.0', result_type='code_example'"
Cline should use the tool with exactly those parameters
You should receive code examples focused on implementing a BLE UART service
Troubleshooting
If you encounter issues:

Check that the MCP server is running (it should start automatically when needed)
Verify your Perplexity API key is correct in the configuration
Look for error messages in the Cline interface
Check the terminal output where Cline is running for any server errors
