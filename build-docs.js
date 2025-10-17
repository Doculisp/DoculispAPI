#!/usr/bin/env node

/**
 * Build script for compiling all Doculisp documents
 * Uses the DoculispApi to compile the doculisp.dlproj file
 */

const { DoculispApi } = require('./dist/index');
const path = require('path');

async function buildDocuments() {
    try {
        console.log('🚀 Starting Doculisp document compilation...\n');
        
        // Initialize the API
        const api = await DoculispApi.create();
        
        // Path to the project file
        const projectPath = path.join(__dirname, 'documentation', 'doculisp.dlproj');
        
        console.log(`📁 Project file: ${projectPath}`);
        console.log('📝 Compiling all documents defined in project...\n');
        
        // Compile the project - this will build all documents defined in the .dlproj file
        const results = await api.compileFile(projectPath);
        
        // Process results
        let successCount = 0;
        let errorCount = 0;
        
        console.log('📊 Compilation Results:');
        console.log('=' .repeat(50));
        
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            
            if (result.success) {
                successCount++;
                if (typeof result.value === 'string') {
                    console.log(`✅ Document ${i + 1}: Successfully compiled`);
                    console.log(`   Output: ${result.value}`);
                } else {
                    console.log(`✅ Document ${i + 1}: Validated successfully (no output written)`);
                }
            } else {
                errorCount++;
                console.log(`❌ Document ${i + 1}: Compilation failed`);
                console.log(`   Error: ${result.message}`);
            }
            console.log(''); // Empty line for readability
        }
        
        // Summary
        console.log('📈 Summary:');
        console.log('=' .repeat(50));
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📄 Total: ${results.length}`);
        
        if (errorCount === 0) {
            console.log('\n🎉 All documents compiled successfully!');
            process.exit(0);
        } else {
            console.log(`\n⚠️  ${errorCount} document(s) failed to compile.`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error('💥 Fatal error during compilation:');
        console.error(error.message);
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Handle process signals gracefully
process.on('SIGINT', () => {
    console.log('\n\n🛑 Build interrupted by user');
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Build terminated');
    process.exit(1);
});

// Run the build
if (require.main === module) {
    buildDocuments();
}

module.exports = { buildDocuments };