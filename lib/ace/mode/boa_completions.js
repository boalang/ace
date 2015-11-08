define(function(require, exports, module) {
"use strict";

var TokenIterator = require("../token_iterator").TokenIterator;

var globalFunctions = [
	"getast",
	"isliteral",
	"hasfiletype",
	"isfixingrevision",
	"remove",
	"push",
	"pop",
	"abs",
	"def",
	"fingerprintof",
	"new",
	"regex",
	"split",
	"splitn",
	"splitall",
	"haskey",
	"contains",
	"add",
	"keys",
	"values",
	"len",
	"lookup",
	"max",
	"min",
	"sort",
	"sortx",
	"convert",
	"addday",
	"addmonth",
	"addweek",
	"addyear",
	"dayofmonth",
	"dayofweek",
	"dayofyear",
	"hourof",
	"minuteof",
	"monthof",
	"secondof",
	"yearof",
	"trunctoday",
	"trunctohour",
	"trunctominute",
	"trunctomonth",
	"trunctosecond",
	"trunctoyear",
	"now",
	"formattime",
	"lowercase",
	"uppercase",
	"strfind",
	"strrfind",
	"substring",
	"strreplace",
	"match",
	"matchposns",
	"matchstrs",
	"format",
	"highbit",
	"rand",
	"nrand",
	"log",
	"log10",
	"exp",
	"sqrt",
	"pow",
	"sin",
	"cos",
	"tan",
	"asin",
	"acos",
	"atan",
	"atan2",
	"cosh",
	"sinh",
	"tanh",
	"acosh",
	"asinh",
	"atanh",
	"ceil",
	"floor",
	"round",
	"trunc",
	"isnan",
	"isinf",
	"isfinite",
	"isnormal"
];

var typeMap = {
	"Project": [],
	"Person": [],
	"CodeRepository": [],
	"Revision": [],
	"ChangedFile": [],
	"ASTRoot": [],
	"Namespace": [],
	"Declaration": [],
	"Type": [],
	"Method": [],
	"Variable": [],
	"Statement": [],
	"Expression": [],
	"Modifier": [],
	"Comment": [],
	"PositionInfo": []
};

var enumMap = {
	"TypeKind": ["CLASS", "INTERFACE", "ANONYMOUS", "STRUCT", "ENUM", "ANNOTATION", "DELEGATE", "GENERIC", "OTHER"],
	"StatementKind": ["BLOCK", "TYPEDECL", "EXPRESSION", "SYNCHRONIZED", "RETURN", "FOR", "DO", "WHILE", "IF", "ASSERT", "BREAK",
						"CONTINUE", "LABEL", "SWITCH", "CASE", "TRY", "THROW", "CATCH", "EMPTY", "OTHER"],
	"ExpressionKind": ["LITERAL", "VARACCESS", "VARDECL", "METHODCALL", "CAST", "ARRAYINDEX", "ARRAYINIT", "TYPECOMPARE", "NEW",
						"NEWARRAY", "OP_ADD", "OP_SUB", "OP_MULT", "OP_DIV", "OP_MOD", "OP_INC", "OP_DEC", "BIT_LSHIFT", "BIT_RSHIFT",
						"BIT_UNSIGNEDRSHIFT", "BIT_AND", "BIT_OR", "BIT_NOT", "BIT_XOR", "LOGICAL_NOT", "LOGICAL_AND", "LOGICAL_OR",
						"EQ", "NEQ", "LT", "GT", "LTEQ", "GTEQ", "CONDITIONAL", "NULLCOALESCE", "ASSIGN", "ASSIGN_ADD", "ASSIGN_SUB",
						"ASSIGN_MULT", "ASSIGN_DIV", "ASSIGN_MOD", "ASSIGN_BITXOR", "ASSIGN_BITAND", "ASSIGN_BITOR", "ASSIGN_LSHIFT",
						"ASSIGN_RSHIFT", "ASSIGN_UNSIGNEDRSHIFT", "OTHER"],
	"ModifierKind": ["VISIBILITY", "ANNOTATION", "FINAL", "STATIC", "SYNCHRONIZED", "OTHER"],
	"Visibility": ["PUBLIC", "PRIVATE", "PROTECTED", "NAMESPACE"],
	"CommentKind": ["LINE", "BLOCK", "DOC", "SPEC"],
	"ChangeKind": ["ADDED", "DELETED", "MODIFIED"],
	"RepositoryKind": ["UNKNOWN", "SVN", "CVS", "GIT", "HG", "BZR"],
	"FileKind": ["UNKNOWN", "BINARY", "TEXT", "XML", "SOURCE_JAVA_ERROR", "SOURCE_JAVA_JLS2", "SOURCE_JAVA_JLS3", "SOURCE_JAVA_JLS4"],
	"IssueKind": ["UNKNOWN", "BUGS", "FEATURES", "SUPPORT", "PATCHES"]
};

function hasType(token, type) {
    var tokenTypes = token.type.split('.');
    return type.split('.').every(function(type){
        return (tokenTypes.indexOf(type) !== -1);
    });
}

function findTagName(session, pos) {
    var iterator = new TokenIterator(session, pos.row, pos.column);
    var token = iterator.getCurrentToken();
	token = iterator.stepBackward();
	return token.value;
}

var BoaCompletions = function() {};

(function() {
    this.getCompletions = function(state, session, pos, prefix) {
        var token = session.getTokenAt(pos.row, pos.column);

        if (!token)
            return [];

        // attribute
        if (token.value == '.')
            return this.getAttributeCompetions(state, session, pos, prefix);

        // functions
        if (hasType(token, "identifier"))
            return this.getFunctionCompletions(prefix);

        return [];
    };

    this.getFunctionCompletions = function(prefix) {
        var funcs = globalFunctions;
        if (prefix) {
            funcs = funcs.filter(function(func){
                return func.indexOf(prefix) === 0;
            });
        }
        return funcs.map(function(func){
            return {
                caption: func,
                snippet: func + '($0)',
                meta: "function"
            };
        });
    };

    this.getAttributeCompetions = function(state, session, pos, prefix) {
        var tagName = findTagName(session, pos);
        if (!tagName)
            return [];
        var attributes = [];
        if (tagName in enumMap) {
            attributes = attributes.concat(enumMap[tagName]);
        }
        if (prefix) {
            attributes = attributes.filter(function(attribute){
                return attribute.indexOf(prefix) === 0;
            });
        }
        return attributes.map(function(attribute){
            return {
                caption: attribute,
                snippet: attribute,
                meta: "type"
            };
        });
    };
}).call(BoaCompletions.prototype);

exports.BoaCompletions = BoaCompletions;
});
