const { parse, TYPE } = require('@formatjs/icu-messageformat-parser');
const { set, get } = require('lodash');
const diff = require('jest-diff');
const requireNoCache = require('./util/require-no-cache');
const getTranslationFileSource = require('./util/get-translation-file-source');
const deepForOwn = require('./util/deep-for-own');

const sortAstNodes = (a, b) => `${a.type}${a.value}`.localeCompare(`${b.type}${b.value}`);

const compareAst = (astA, astB) => {
  // Skip raw text
  const astAFiltered = astA.filter(a => a.type !== TYPE.literal).sort(sortAstNodes);
  const astBFiltered = astB.filter(a => a.type !== TYPE.literal).sort(sortAstNodes);

  if (astAFiltered.length !== astBFiltered.length) {
    return false;
  }

  if (astAFiltered.length === 0) {
    return true;
  }

  return astAFiltered.every((elementA, index) => {
    const elementB = astBFiltered[index];

    // Type and value should match for each placeholder
    if (elementA.type !== elementB.type || elementA.value !== elementB.value) {
      return false;
    }

    if (elementA.type === TYPE.select || elementA.type === TYPE.plural) {
      const elementAOptions = Object.keys(elementA.options).sort();
      const elementBOptions = Object.keys(elementB.options).sort();
      if (
        elementAOptions.length !== elementBOptions.length ||
        elementAOptions.join('|') !== elementBOptions.join('|')
      ) {
        return false;
      }

      return elementAOptions.every(o =>
        compareAst(elementA.options[o].value, elementB.options[o].value));
    }

    // Compare children for type 8 (rich text)
    if (elementA.type === TYPE.tag) {
      return compareAst(elementA.children, elementB.children);
    }

    return true;
  });
};

const identicalPlaceholders = (context, source, sourceFilePath) => {
  const { options, settings } = context;
  const { filePath } = options[0] || {};

  if (!filePath) {
    return [
      {
        message: '"filePath" rule option not specified.',
        loc: {
          start: {
            line: 0,
            col: 0
          }
        }
      }
    ];
  }

  // skip comparison with reference file
  if (filePath === sourceFilePath) {
    return [];
  }

  let referenceTranslations = null;
  let sourceTranslations = null;
  try {
    referenceTranslations = requireNoCache(filePath);
    sourceTranslations = JSON.parse(source);
  } catch (e) {
    // don't return any errors
    // will be caught with the valid-json rule.
    return [];
  }

  const ignorePaths = settings['i18n-json/ignore-keys'] || [];
  const invalidMessages = [];

  deepForOwn(
    referenceTranslations,
    (referenceTranslation, _, path) => {
      if (typeof referenceTranslation === 'string') {
        const sourceTranslation = get(sourceTranslations, path);
        if (sourceTranslation) {
          let referenceAst;
          let sourceAst;
          try {
            referenceAst = parse(referenceTranslation);
            sourceAst = parse(sourceTranslation);
          } catch (e) {
            // don't return any errors
            // will be caught with the valid-message-syntax rule.
            return;
          }
          if (!compareAst(referenceAst, sourceAst)) {
            invalidMessages.push({
              path,
              referenceTranslation,
              sourceTranslation
            });
          }
        }
      }
    },
    {
      ignorePaths
    }
  );

  if (invalidMessages.length === 0) {
    return [];
  }

  const expected = {};
  const received = {};
  invalidMessages.forEach(({ path, referenceTranslation, sourceTranslation }) => {
    set(expected, path, referenceTranslation);
    set(received, path, `${sourceTranslation} ===> Placeholders don't match`);
  });

  return [
    {
      message: `\n${diff(expected, received)}`,
      loc: {
        start: {
          line: 0,
          col: 0
        }
      }
    }
  ];
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Consistency',
      description:
        'Verifies the ICU message placeholders for the translations matches with the reference language file specified in the options'
    },
    schema: [
      {
        properties: {
          filePath: {
            type: 'string'
          }
        },
        type: 'object'
      }
    ]
  },
  create(context) {
    return {
      Program(node) {
        const { valid, source, sourceFilePath } = getTranslationFileSource({
          context,
          node
        });
        if (!valid) {
          return;
        }
        const errors = identicalPlaceholders(context, source, sourceFilePath);
        errors.forEach((error) => {
          context.report(error);
        });
      }
    };
  }
};
