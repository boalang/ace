define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var BoaHighlightRules = function() {

    var keywords = (
        "output|weight|of|" +                                                               // tables
        "exists|foreach|ifall|" +                                                           // quantifiers
        "for|if|else|while|function|switch|case|break|default|return|continue|do|static|" + // keywords
        "traverse|traversal|fixp|" +                                                        // traversals
        "visit|before|after|_|stop"                                                         // visitors
    );

    var types = (
         "visitor|type|int|float|string|time|bool|fingerprint|enum|array|map|stack|set|queue|" + // basic types
         "Project|CodeRepository|Revision|ChangedFile|Person|" +                                 // DSL types
         "ASTRoot|Namespace|Declaration|Type|Method|Variable|Statement|" +
         "Expression|Modifier|Comment|PositionInfo|" +
         "TypeKind|TypeKind.CLASS|TypeKind.INTERFACE|TypeKind.ANONYMOUS|TypeKind.STRUCT|" +      // enums
         "TypeKind.ENUM|TypeKind.ANNOTATION|TypeKind.DELEGATE|TypeKind.GENERIC|" +
         "TypeKind.OTHER|" +
         "StatementKind|StatementKind.BLOCK|StatementKind.TYPEDECL|StatementKind.EXPRESSION|" +
         "StatementKind.SYNCHRONIZED|StatementKind.RETURN|StatementKind.FOR|" +
         "StatementKind.DO|StatementKind.WHILE|StatementKind.IF|StatementKind.ASSERT|" +
         "StatementKind.BREAK|StatementKind.CONTINUE|StatementKind.LABEL|" +
         "StatementKind.SWITCH|StatementKind.CASE|StatementKind.TRY|StatementKind.THROW|" +
         "StatementKind.CATCH|StatementKind.EMPTY|StatementKind.OTHER|" +
         "ExpressionKind|ExpressionKind.LITERAL|ExpressionKind.VARACCESS|ExpressionKind.VARDECL|" +
         "ExpressionKind.METHODCALL|ExpressionKind.CAST|ExpressionKind.ARRAYINDEX|" +
         "ExpressionKind.ARRAYINIT|ExpressionKind.TYPECOMPARE|ExpressionKind.NEW|" +
         "ExpressionKind.NEWARRAY|ExpressionKind.OP_ADD|ExpressionKind.OP_SUB|" +
         "ExpressionKind.OP_MULT|ExpressionKind.OP_DIV|ExpressionKind.OP_MOD|" +
         "ExpressionKind.OP_INC|ExpressionKind.OP_DEC|ExpressionKind.BIT_LSHIFT|" +
         "ExpressionKind.BIT_RSHIFT|ExpressionKind.BIT_UNSIGNEDRSHIFT|" +
         "ExpressionKind.BIT_AND|ExpressionKind.BIT_OR|ExpressionKind.BIT_NOT|" +
         "ExpressionKind.BIT_XOR|ExpressionKind.LOGICAL_NOT|ExpressionKind.LOGICAL_AND|" +
         "ExpressionKind.LOGICAL_OR|ExpressionKind.EQ|ExpressionKind.NEQ|" +
         "ExpressionKind.LT|ExpressionKind.GT|ExpressionKind.LTEQ|ExpressionKind.GTEQ|" +
         "ExpressionKind.CONDITIONAL|ExpressionKind.NULLCOALESCE|ExpressionKind.ASSIGN|" +
         "ExpressionKind.ASSIGN_ADD|ExpressionKind.ASSIGN_SUB|ExpressionKind.ASSIGN_MULT|" +
         "ExpressionKind.ASSIGN_DIV|ExpressionKind.ASSIGN_MOD|ExpressionKind.ASSIGN_BITXOR|" +
         "ExpressionKind.ASSIGN_BITAND|ExpressionKind.ASSIGN_BITOR|" +
         "ExpressionKind.ASSIGN_LSHIFT|ExpressionKind.ASSIGN_RSHIFT|" +
         "ExpressionKind.ASSIGN_UNSIGNEDRSHIFT|ExpressionKind.OTHER|" +
         "ModifierKind|ModifierKind.VISIBILITY|ModifierKind.ANNOTATION|ModifierKind.FINAL|" +
         "ModifierKind.STATIC|ModifierKind.SYNCHRONIZED|ModifierKind.OTHER|" +
         "Visibility|Visibility.PUBLIC|Visibility.PRIVATE|Visibility.PROTECTED|Visibility.NAMESPACE|" +
         "CommentKind|CommentKind.LINE|CommentKind.BLOCK|CommentKind.DOC|CommentKind.SPEC|" +
         "ChangeKind|ChangeKind.ADDED|ChangeKind.DELETED|ChangeKind.MODIFIED|" +
         "RepositoryKind|RepositoryKind.UNKNOWN|RepositoryKind.SVN|RepositoryKind.CVS|RepositoryKind.GIT|" +
         "RepositoryKind.HG|RepositoryKind.BZR|" +
         "FileKind|FileKind.UNKNOWN|FileKind.BINARY|FileKind.TEXT|FileKind.XML|" +
         "FileKind.SOURCE_JAVA_ERROR|FileKind.SOURCE_JAVA_JLS2|FileKind.SOURCE_JAVA_JLS3|" +
         "FileKind.SOURCE_JAVA_JLS4|" +
         "IssueKind|IssueKind.UNKNOWN|IssueKind.BUGS|IssueKind.FEATURES|IssueKind.SUPPORT|IssueKind.PATCHES|" +
         "TraversalDirection|TraversalDirection.FORWARD|TraversalDirection.BACKWARD|" +
         "TraversalKind|TraversalKind.DFS|TraversalKind.POSTORDER|TraversalKind.REVERSEPOSTORDER|TraversalKind.WORKLIST_POSTORDER|TraversalKind.WORKLIST_REVERSEPOSTORDER|TraversalKind.ITERATIVE|TraversalKind.RANDOM|TraversalKind.HYBRID"
    );

    var builtinVariables = (
        "input"
    );

    var builtinConstants = (
        "true|false|PI|Inf|inf|NaN|nan|SECOND|SEC|MINUTE|MIN|HOUR|HR"
    );

    var builtinFunctions = (
        "collection|sum|top|bottom|mean|maximum|minimum|unique|set|quantile|" + // aggregators
        "histogram|text|" +
        "getast|getsnapshot|isliteral|hasfiletype|isfixingrevision|ast_len|" +  // DSL funcs
        "clear|remove|add|push|pop|abs|def|fingerprintof|" +                    // intrinsics
        "new|regex|split|splitn|splitall|haskey|contains|containsall|values|keys|len|lookup|max|min|sort|sortx|" +
        "convert|addday|addmonth|addweek|addyear|dayofmonth|dayofweek|" +
        "dayofyear|hourof|minuteof|monthof|secondof|yearof|trunctoday|trunctohour|" +
        "trunctominute|trunctomonth|trunctosecond|trunctoyear|now|formattime|" +
        "lowercase|uppercase|strfind|strrfind|substring|" +
        "strreplace|match|matchposns|matchstrs|" +
        "format|highbit|rand|nrand|log|log10|exp|sqrt|pow|sin|cos|tan|" +
        "asin|acos|atan|atan2|cosh|sinh|tanh|acosh|asinh|atanh|ceil|floor|" +
        "round|trunc|isnan|isinf|isfinite|isnormal|" +
        "difference|union|intersect|symdiff|" +
        "getoutedge|normalize|gettotalnodes|gettotalcontrolnodes|gettotaledges|" +
        "getcfg|getcdg|getddg|getpdg|getpdtree|getcfgslice|getpdgslice|dot|parse|parseexpression|prettyprint"
    );

    var keywordMapper = this.$keywords = this.createKeywordMapper({
        "keyword" : keywords,
        "storage.type" : types,
        "support.function" : builtinFunctions,
        "variable.language": builtinVariables,
        "constant.language": builtinConstants
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "#.*$"
            }, {
                token : "string", // multi line """ string start
                regex : '"{3}',
                next : "qqstring3"
            }, {
                token : "string.regex", // regex single line
                regex : "[`](?:(?:\\\\.)|(?:[^`\\\\]))*?[`]"
            }, {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "constant.numeric", // hex
                regex : "0x[0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : keywordMapper,
                regex : "[a-zA-Z_$][a-zA-Z0-9._$]*"
            }, {
                token : "keyword.operator",
                regex : "\\?|=|\\+|\\-|\\*|\\/|\\+\\+|\\-\\-|:|<\\-|\\$|%|&|\\||\\^|~|<<|>>|==|!=|<|<=|>|>=|&&|\\|\\||!|\\b(?:and|not|or)"
            }, {
                token : "lparen",
                regex : "[[({]"
            }, {
                token : "rparen",
                regex : "[\\])}]"
            }, {
                token : "text",
                regex : "\\s+"
            }
        ],
        "qqstring3": [{
            token: "constant.language.escape",
            regex: "\\\\\""
        }, {
            token: "string", // multi line """ string end
            regex: '"{3}',
            next: "start"
        }, {
            defaultToken: "string"
        }]
    };
};

oop.inherits(BoaHighlightRules, TextHighlightRules);

exports.BoaHighlightRules = BoaHighlightRules;
});
