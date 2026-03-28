import { IRegisterable } from "../types/types.containers";
import { IUtil, Result } from "../types/types.general";
import { IVersion } from "../types/types.version";
import { PathConstructor } from "../types/types.filePath";

function buildVersion(util: IUtil, pathConstructor: PathConstructor): IVersion {
    const failureBuilder = util.fail('Package Information Retrieval');
    
    function getVersion(): Result<string> {
        const file = require('../../package.json');

        if(!file || !file['version']) {
            return failureBuilder('Validation Error')('Could not find the version in package.json.', undefined, pathConstructor('../../package.json'));
        }

        return util.ok(file['version'] as string);
    }

    return {
        getVersion,
    };
}

const versionBuilder: IRegisterable = {
    builder: (util: IUtil, pathConstructor: PathConstructor) => buildVersion(util, pathConstructor),
    name: 'version',
    dependencies: ['util', 'pathConstructor'],
    singleton: true
};

export {
    versionBuilder,
};