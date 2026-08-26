import { DoculispPart, IDoculisp, IEmptyDoculisp, IHeader, ILoad, IPathId, ISectionWriter, ITableOfContents, ITitle, IWrite } from "../types/types.astDoculisp";
import { IRegisterable } from "../types/types.containers";
import { ILocation, ILocationCoordinates, IRange, IUtil, Result } from "../types/types.general";
import { IStringBuilder, StringBuilderConstructor } from "../types/types.sringBuilder";
import { IStringWriter } from "../types/types.stringWriter";
import { destKey, IStringArray, IVariableEmptyId, IVariableId, IVariablePath, IVariableTable } from "../types/types.variableTable";

function buildWriter(util: IUtil, stringBuilderConstructor: StringBuilderConstructor) : IStringWriter {

    // Structured error handling helpers
    const validationFailure = util.fail('Building Document')('Validation Error');

    function writeAstWrite(astWrite: IWrite) : string {
        return astWrite.value;
    }

    // Range-based parts use start/end while legacy point-based parts still expose documentOrder.
    function partStart(part: DoculispPart): ILocationCoordinates {
        return part.type === 'doculisp-write' || part.type === 'doculisp-path-id' || part.type === 'doculisp-content' || part.type === 'doculisp-header' || part.type === 'doculisp-toc' ? part.start : part.documentOrder;
    }

    
    function writeAstTitle(astTitle: ITitle): string {
        const sb = stringBuilderConstructor();
    
        sb.addLine(astTitle.label);
    
        if(astTitle.subtitle) {
            sb.addLine();
            sb.addLine(astTitle.subtitle);
        }

        return sb.toString();
    }
    
    function writeAstHeader(astHeader: IHeader): string {
        const headMarker = '#'.repeat(astHeader.depthCount);
        return `${headMarker} ${astHeader.text} ${headMarker}`;
    }
    
    function writeTableOfContents(toc: ITableOfContents, loads: ILoad[]): string {
        function findTitle(doculisp: DoculispPart[]): ITitle | null {
            for (let index = 0; index < doculisp.length; index++) {
                const element = doculisp[index];
                if(!element) {
                    continue;
                }
    
                if(element.type === 'doculisp-title') {
                    return element;
                }
            }
    
            return null;
        }
    
        function useLabel(append: (text: string) => void, title: string, linkText: string, label?: string): void {
            let lblText = !!label ? `${label}: `: '';
            
            append(`${lblText}[${title}](${linkText})`);
        }
    
        function ignoreLabel(append: (text: string) => void, title: string, linkText: string, label?: string): void {
            return useLabel(append, title, linkText);
        }
    
        function writeRawLink(appender: (append: (text: string) => void, title: string, linkText: string, label?: string) => void): (sb: IStringBuilder, title: string, linkText: string, label: string) => void {
            return function(sb: IStringBuilder, title: string, linkText: string, label: string): void {
                appender(text => sb.addLine(text), title, linkText, label);
            }
        }
    
        function writeNumbered(appender: (append: (text: string) => void, title: string, linkText: string, label?: string) => void): (sb: IStringBuilder, title: string, linkText: string, label: string) => void {
            let cnt = 1;
            return function(sb: IStringBuilder, title: string, linkText: string, label: string): void {
                appender(text => sb.add(`${cnt}. ${text}`), title, linkText, label);
                cnt++;
            }
        }
    
        function writeBulleted(appender: (append: (text: string) => void, title: string, linkText: string, label?: string) => void): (sb: IStringBuilder, title: string, linkText: string, label: string) => void {
            return function(sb: IStringBuilder, title: string, linkText: string, label: string): void {
                appender(text => sb.add(`* ${text}`), title, linkText, label);
            }
        }
    
        function writeTable(loads: ILoad[], addRow: (sb: IStringBuilder, title: string, linkText: string, label: string) => void): string {
            const sb = stringBuilderConstructor();
    
            for (let index = 0; index < loads.length; index++) {
                const element = loads[index];
                if(!element) {
                    continue;
                }
        
                if(!element.document) {
                    continue;
                }
        
                const doc = element.document;
                const title = findTitle(doc.doculisp);
        
                if(!title) {
                    continue;
                }
        
                if(0 < sb.length) {
                    sb.addLine();
                }
    
                addRow(sb, title.title, title.ref_link, element.sectionLabel);
            }
        
            return sb.toString();
        }
    
        const sb = stringBuilderConstructor();
        if(toc.label) {
            sb.addLine(toc.label);
            sb.addLine();
        }
    
        switch (toc.bulletStyle) {
            case 'labeled':
                sb.addLine(writeTable(loads, writeRawLink(useLabel)));
                return sb.toString();
    
            case 'unlabeled':
                sb.addLine(writeTable(loads, writeRawLink(ignoreLabel)));
                return sb.toString();
    
            case 'numbered':
                sb.addLine(writeTable(loads, writeNumbered(ignoreLabel)));
                return sb.toString();
    
            case 'numbered-labeled':
                sb.addLine(writeTable(loads, writeNumbered(useLabel)));
                return sb.toString();
    
            case 'bulleted':
                sb.addLine(writeTable(loads, writeBulleted(ignoreLabel)));
                return sb.toString();
    
            case 'bulleted-labeled':
                sb.addLine(writeTable(loads, writeBulleted(useLabel)));
                return sb.toString();
        
            default:
                return `>>>> ${toc.bulletStyle} <<<<\n`;
        }
        
    }
    
    function writeContent(loads: ILoad[], variableTable: IVariableTable): Result<string> {
        const sb = stringBuilderConstructor();
    
        for (let index = 0; index < loads.length; index++) {
            const load = loads[index];
            if(!load) {
                continue;
            }
    
            if(!load.document) {
                continue;
            }
    
            const doc = load.document;
let previous: ILocationCoordinates = doc.start;
    
            if(0 < sb.length) {
                sb.addLine();
            }

            const sectionResult = writeSection(previous, doc, variableTable);

            if(!sectionResult.success) {
                return sectionResult;
            }
    
            sb.addLine(sectionResult.value);
        }
    
        return util.ok(sb.toString().trim());
    }

    function writeGetPath(astIdPath: IPathId, table: IVariableTable): Result<string> {
        const range: IRange = { start: astIdPath.start, end: astIdPath.end };

        if(!table.hasKey(astIdPath.id)) {
            return validationFailure(`Unknown document ID '${astIdPath.id}' at '${astIdPath.start.documentPath}'.`, range, astIdPath.start.documentPath);
        }

        const output = (
            table.hasKey(destKey) ?
            (table.getValue(destKey) as IVariablePath) :
            false
        );

        const idPathVariable = table.getValue(astIdPath.id) as IVariableId | IVariableEmptyId | false;

        if(!idPathVariable) {
            return validationFailure(`Unknown document ID '${astIdPath.id}' at '${astIdPath.start.documentPath}'.`, range, astIdPath.start.documentPath);
        }

        if(idPathVariable.type === 'variable-empty-id' || !output) {
            return util.ok('');
        }

        const idPath = idPathVariable.value;
        const outPutPath = output.value;

        const headerLinkText = 
            idPathVariable.headerLinkText ? 
            '#' + idPathVariable.headerLinkText : 
            '';

        if(idPath.fullName === outPutPath.fullName) {
            return util.ok(headerLinkText);
        }

        return util.ok('./' + idPath.getRelativeFrom(outPutPath.getContainingDir()).replaceAll('\\', '/') + headerLinkText);
    }
    
    function writeSection(previous: ILocationCoordinates, section: ISectionWriter, variableTable: IVariableTable): Result<string> {
        const sb = stringBuilderConstructor();
        let previousType = '';
        let previousLine = (
            !!section.doculisp?.length
            ? partStart(section.doculisp[0] as DoculispPart).line
            : 0
        );
    
        for (let index = 0; index < section.doculisp.length; index++) {
            const doculisp = section.doculisp[index];
            if(!doculisp) {
                continue;
            }
    
            const start = partStart(doculisp);
    
            if (previousLine < start.line) {
                sb.addLine();
            }

            previousLine = start.line;
    
            if((previousType === 'doculisp-write' || previousType === 'doculisp-path-id') && (doculisp.type === 'doculisp-write' || doculisp.type === 'doculisp-path-id')) {
                if(previous.documentPath !== start.documentPath
                   || (previous.line + 2) <= start.line
                   || (start.line + 2) <= previous.line
                ) {
                    sb.addLine();
                }
            }
            else {
                sb.addLine();
            }
    
            switch (doculisp.type) {
                case 'doculisp-write':
                    sb.add(writeAstWrite(doculisp));
                    break;
    
                case 'doculisp-title':
                    sb.add(writeAstTitle(doculisp));
                    break;
    
                case 'doculisp-header':
                    sb.add(writeAstHeader(doculisp));
                    break;
    
                case 'doculisp-content':
                    const contentResult = writeContent(section.include, variableTable);
                    if(!contentResult.success) {
                        return contentResult;
                    }

                    sb.add(contentResult.value);
                    break;
    
                case 'doculisp-toc':
                    sb.add(writeTableOfContents(doculisp, section.include));
                    sb.addLine();
                    break;

                case 'doculisp-path-id':
                    const pathResult = writeGetPath(doculisp, variableTable);
                    if(!pathResult.success) {
                        return pathResult;
                    }

                    sb.add(pathResult.value);
                    break;
            
                default:
                    break;
            }
    
            previousType = doculisp.type;
            previous = start;
        }
    
        return util.ok(sb.toString());
    }

    function buildAuthorTable(variableTable: IVariableTable): string | false {
        const authorsVariable = variableTable.getValue<IStringArray>('author');

        if(!authorsVariable){
            return false;
        }

        const authors = authorsVariable.value.map(v => v.value);

        if(authors.length === 0) {
            return false;
        }

        const sb = stringBuilderConstructor();
        authors.forEach(name => {
            sb.addLine(`<!-- Written By: ${name} -->`);
        });

        return sb.toString();
    }

    function writeAst(astMaybe: Result<IDoculisp | IEmptyDoculisp>, variableTable: IVariableTable): Result<string> {
        if(!astMaybe.success) {
            return astMaybe;
        }

        if(astMaybe.value.type === 'doculisp-empty'){
            return util.ok('');
        }

        const authorsMaybe = buildAuthorTable(variableTable);

        const sb = stringBuilderConstructor();
        const section = astMaybe.value.section;

        sb.addLine('<!-- GENERATED DOCUMENT DO NOT EDIT! -->');
        sb.addLine('<!-- prettier-ignore-start -->');
        sb.addLine('<!-- markdownlint-disable -->');
        sb.addLine();
        sb.addLine(`<!-- Compiled with doculisp https://www.npmjs.com/package/doculisp -->`);
        if(authorsMaybe){
            sb.addLine(authorsMaybe);
        }
        sb.addLine();


        let previous: ILocation = util.location(astMaybe.value.projectLocation.documentPath, -1, -1, -1, -1);
        const writeResult = writeSection(previous, section, variableTable);

        if(!writeResult.success) {
            return writeResult;
        }

        sb.addLine(writeResult.value);
        
        sb.addLine();
        if(authorsMaybe){
            sb.addLine(authorsMaybe);
        }
        sb.addLine('<!-- markdownlint-restore -->');
        sb.addLine('<!-- prettier-ignore-end -->');
        sb.addLine('<!-- GENERATED DOCUMENT DO NOT EDIT! -->');
        return util.ok(sb.toString());
    }

    return {
        writeAst,
    }
}

const stringWriter: IRegisterable = {
    builder: (util: IUtil, stringBuilderConstructor: StringBuilderConstructor) => buildWriter(util, stringBuilderConstructor),
    name: 'stringWriter',
    dependencies: ['util', 'stringBuilder'],
    singleton: false,
};

export {
    stringWriter,
};