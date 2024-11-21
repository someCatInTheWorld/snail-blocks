/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2017 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Data Flyout components including variable and list blocks.
 * @author marisaleung@google.com (Marisa Leung)
 */
'use strict';

/**
 * @name Blockly.VariableCategory
 * @namespace
 **/
goog.provide('Blockly.VariableCategory');

goog.require('Blockly.Blocks');
goog.require('Blockly.VariableModel');
goog.require('Blockly.Variables');
goog.require('Blockly.Workspace');

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Blockly.Workspace} workspace The workspace containing variables.
 * @return {!Array.<!Element>} Array of XML block elements.
 */
Blockly.VariableCategory = function(workspace) {
  var variableModelList = workspace.getVariablesOfType('');
  var localVars = variableModelList.filter(v => v.isLocal);
  var globalVars = variableModelList.filter(v => !v.isLocal);
  localVars.sort(Blockly.VariableModel.compareByName);
  globalVars.sort(Blockly.VariableModel.compareByName);
  var xmlList = [];

  Blockly.VariableCategory.addCreateButton(xmlList, workspace, 'VARIABLE');
  if (globalVars.length > 0) {
    Blockly.VariableCategory.addLabel(xmlList, "Variables for all sprites")
    for (var i = 0; i < globalVars.length; i++) {
      Blockly.VariableCategory.addDataVariable(xmlList, globalVars[i]);
    }
  }
  if (localVars.length > 0) { 
    Blockly.VariableCategory.addLabel(xmlList, "Variables for this sprite")
    for (var i = 0; i < localVars.length; i++) {
      Blockly.VariableCategory.addDataVariable(xmlList, localVars[i]);
    }
  }

  if (variableModelList.length > 0) {
    xmlList[xmlList.length - 1].setAttribute('gap', 28);
    var firstVariable = variableModelList[0];

    Blockly.VariableCategory.addSetVariableTo(xmlList, firstVariable);
    Blockly.VariableCategory.addChangeVariableBy(xmlList, firstVariable);
    Blockly.VariableCategory.addShowVariable(xmlList, firstVariable);
    Blockly.VariableCategory.addHideVariable(xmlList, firstVariable);
  }

  return xmlList;
};
Blockly.VariableCategory.ListCategory = function(workspace) {
  var variableModelList = workspace.getVariablesOfType('list');
  var localVars = variableModelList.filter(v => v.isLocal);
  var globalVars = variableModelList.filter(v => !v.isLocal);
  localVars.sort(Blockly.VariableModel.compareByName);
  globalVars.sort(Blockly.VariableModel.compareByName);
  var xmlList = [];

  Blockly.VariableCategory.addCreateButton(xmlList, workspace, 'LIST');
  if (globalVars.length > 0) {
    Blockly.VariableCategory.addLabel(xmlList, "Lists for all sprites")
    for (var i = 0; i < globalVars.length; i++) {
      Blockly.VariableCategory.addDataList(xmlList, globalVars[i]);
    }
  }
  if (localVars.length > 0) {
    Blockly.VariableCategory.addLabel(xmlList, "Lists for this sprite")
    for (var i = 0; i < localVars.length; i++) {
      Blockly.VariableCategory.addDataList(xmlList, localVars[i]);
    }
  }

  if (variableModelList.length > 0) {
    xmlList[xmlList.length - 1].setAttribute('gap', 28);
    var firstList = variableModelList[0];

    Blockly.VariableCategory.addAddToList(xmlList, firstList);
    Blockly.VariableCategory.addSep(xmlList);
    Blockly.VariableCategory.addDeleteOfList(xmlList, firstList);
    Blockly.VariableCategory.addDeleteAllOfList(xmlList, firstList);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_shiftlist', 'LIST',
        ['INDEX', 'math_integer', 1]);
    Blockly.VariableCategory.addInsertAtList(xmlList, firstList);
    Blockly.VariableCategory.addReplaceItemOfList(xmlList, firstList);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_listforeachitem', 'LIST');
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_listforeachnum', 'LIST');
    Blockly.VariableCategory.addSep(xmlList);
    Blockly.VariableCategory.addItemOfList(xmlList, firstList);
    Blockly.VariableCategory.addItemNumberOfList(xmlList, firstList);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_amountinlist',
        'LIST', ['VALUE', 'text', "foo"]);
    Blockly.VariableCategory.addLengthOfList(xmlList, firstList);
    Blockly.VariableCategory.addListContainsItem(xmlList, firstList);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_itemexistslist', 'LIST', 
        ['INDEX', 'math_integer', 1]);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_listisempty', 'LIST');
    Blockly.VariableCategory.addSep(xmlList);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_reverselist', 'LIST');
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_arraylist',
        'LIST', ['VALUE', 'text', '["a", "b", "c"]']);
    Blockly.VariableCategory.addBlock(xmlList, firstList, 'data_listarray', 'LIST');
    Blockly.VariableCategory.addSep(xmlList);
    Blockly.VariableCategory.addShowList(xmlList, firstList);
    Blockly.VariableCategory.addHideList(xmlList, firstList);
  }

  return xmlList;
}

/**
 * Construct and add a data_variable block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addDataVariable = function(xmlList, variable) {
  // <block id="variableId" type="data_variable">
  //    <field name="VARIABLE">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_variable', 'VARIABLE');
  // In the flyout, this ID must match variable ID for monitor syncing reasons
  xmlList[xmlList.length - 1].setAttribute('id', variable.getId());
};

/**
 * Construct and add a data_setvariableto block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addSetVariableTo = function(xmlList, variable) {
  // <block type="data_setvariableto" gap="20">
  //   <value name="VARIABLE">
  //    <shadow type="data_variablemenu"></shadow>
  //   </value>
  //   <value name="VALUE">
  //     <shadow type="text">
  //       <field name="TEXT">0</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_setvariableto',
      'VARIABLE', ['VALUE', 'text', 0]);
};

/**
 * Construct and add a data_changevariableby block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addChangeVariableBy = function(xmlList, variable) {
  // <block type="data_changevariableby">
  //   <value name="VARIABLE">
  //    <shadow type="data_variablemenu"></shadow>
  //   </value>
  //   <value name="VALUE">
  //     <shadow type="math_number">
  //       <field name="NUM">1</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_changevariableby',
      'VARIABLE', ['VALUE', 'math_number', 1]);
};

/**
 * Construct and add a data_showVariable block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addShowVariable = function(xmlList, variable) {
  // <block type="data_showvariable">
  //   <value name="VARIABLE">
  //     <shadow type="data_variablemenu"></shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_showvariable',
      'VARIABLE');
};

/**
 * Construct and add a data_hideVariable block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addHideVariable = function(xmlList, variable) {
  // <block type="data_hidevariable">
  //   <value name="VARIABLE">
  //     <shadow type="data_variablemenu"></shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_hidevariable',
      'VARIABLE');
};

/**
 * Construct and add a data_listcontents block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addDataList = function(xmlList, variable) {
  // <block id="variableId" type="data_listcontents">
  //    <field name="LIST">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_listcontents', 'LIST');
  // In the flyout, this ID must match variable ID for monitor syncing reasons
  xmlList[xmlList.length - 1].setAttribute('id', variable.getId());
};

/**
 * Construct and add a data_addtolist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addAddToList = function(xmlList, variable) {
  // <block type="data_addtolist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  //   <value name="ITEM">
  //     <shadow type="text">
  //       <field name="TEXT">thing</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_addtolist', 'LIST',
      ['ITEM', 'text', Blockly.Msg.DEFAULT_LIST_ITEM]);
};

/**
 * Construct and add a data_deleteoflist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addDeleteOfList = function(xmlList, variable) {
  // <block type="data_deleteoflist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  //   <value name="INDEX">
  //     <shadow type="math_integer">
  //       <field name="NUM">1</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_deleteoflist', 'LIST',
      ['INDEX', 'math_integer', 1]);
};

/**
 * Construct and add a data_deleteoflist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addDeleteAllOfList = function(xmlList, variable) {
  // <block type="data_deletealloflist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_deletealloflist',
      'LIST');
};

/**
 * Construct and add a data_insertatlist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addInsertAtList = function(xmlList, variable) {
  // <block type="data_insertatlist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  //   <value name="INDEX">
  //     <shadow type="math_integer">
  //       <field name="NUM">1</field>
  //     </shadow>
  //   </value>
  //   <value name="ITEM">
  //     <shadow type="text">
  //       <field name="TEXT">thing</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_insertatlist', 'LIST',
      ['INDEX', 'math_integer', 1], ['ITEM', 'text', Blockly.Msg.DEFAULT_LIST_ITEM]);
};

/**
 * Construct and add a data_replaceitemoflist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addReplaceItemOfList = function(xmlList, variable) {
  // <block type="data_replaceitemoflist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  //   <value name="INDEX">
  //     <shadow type="math_integer">
  //       <field name="NUM">1</field>
  //     </shadow>
  //   </value>
  //   <value name="ITEM">
  //     <shadow type="text">
  //       <field name="TEXT">thing</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_replaceitemoflist',
      'LIST', ['INDEX', 'math_integer', 1], ['ITEM', 'text', Blockly.Msg.DEFAULT_LIST_ITEM]);
};

/**
 * Construct and add a data_itemoflist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addItemOfList = function(xmlList, variable) {
  // <block type="data_itemoflist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  //   <value name="INDEX">
  //     <shadow type="math_integer">
  //       <field name="NUM">1</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_itemoflist', 'LIST',
      ['INDEX', 'math_integer', 1]);
};

/** Construct and add a data_itemnumoflist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addItemNumberOfList = function(xmlList, variable) {
  // <block type="data_itemnumoflist">
  //   <value name="ITEM">
  //     <shadow type="text">
  //       <field name="TEXT">thing</field>
  //     </shadow>
  //   </value>
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_itemnumoflist',
      'LIST', ['ITEM', 'text', Blockly.Msg.DEFAULT_LIST_ITEM]);
};

/**
 * Construct and add a data_lengthoflist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addLengthOfList = function(xmlList, variable) {
  // <block type="data_lengthoflist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_lengthoflist', 'LIST');
};

/**
 * Construct and add a data_listcontainsitem block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addListContainsItem = function(xmlList, variable) {
  // <block type="data_listcontainsitem">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  //   <value name="ITEM">
  //     <shadow type="text">
  //       <field name="TEXT">thing</field>
  //     </shadow>
  //   </value>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_listcontainsitem',
      'LIST', ['ITEM', 'text', Blockly.Msg.DEFAULT_LIST_ITEM]);
};

/**
 * Construct and add a data_showlist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addShowList = function(xmlList, variable) {
  // <block type="data_showlist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_showlist', 'LIST');
};

/**
 * Construct and add a data_hidelist block to xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 */
Blockly.VariableCategory.addHideList = function(xmlList, variable) {
  // <block type="data_hidelist">
  //   <field name="LIST" variabletype="list" id="">variablename</field>
  // </block>
  Blockly.VariableCategory.addBlock(xmlList, variable, 'data_hidelist', 'LIST');
};

/**
 * Construct a create variable button and push it to the xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {Blockly.Workspace} workspace Workspace to register callback to.
 * @param {string} type Type of variable this is for. For example, 'LIST' or
 *     'VARIABLE'.
 */
Blockly.VariableCategory.addCreateButton = function(xmlList, workspace, type) {
  var button = goog.dom.createDom('button');
  // Set default msg, callbackKey, and callback values for type 'VARIABLE'
  var msg = Blockly.Msg.NEW_VARIABLE;
  var callbackKey = 'CREATE_VARIABLE';
  var callback = function(button) {
    Blockly.Variables.createVariable(button.getTargetWorkspace(), null, '');};

  if (type === 'LIST') {
    msg = Blockly.Msg.NEW_LIST;
    callbackKey = 'CREATE_LIST';
    callback = function(button) {
      Blockly.Variables.createVariable(button.getTargetWorkspace(), null,
          Blockly.LIST_VARIABLE_TYPE);};
  }
  button.setAttribute('text', msg);
  button.setAttribute('callbackKey', callbackKey);
  workspace.registerButtonCallback(callbackKey, callback);
  xmlList.push(button);
};

Blockly.VariableCategory.addLabel = function(xmlList, text) {
  var labelText = '<xml><label text="' + text + '"></label></xml>';
  var label = Blockly.Xml.textToDom(labelText).firstChild;
  xmlList.push(label);
}

/**
 * Construct a variable block with the given variable, blockType, and optional
 *     value tags. Add the variable block to the given xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 * @param {?Blockly.VariableModel} variable Variable to select in the field.
 * @param {string} blockType Type of block. For example, 'data_hidelist' or
 *     data_showlist'.
 * @param {string} fieldName Name of field in block. For example: 'VARIABLE' or
 *     'LIST'.
 * @param {?Array.<string>} opt_value Optional array containing the value name
 *     and shadow type of value tags.
 * @param {?Array.<string>} opt_secondValue Optional array containing the value
 *     name and shadow type of a second pair of value tags.
 */
Blockly.VariableCategory.addBlock = function(xmlList, variable, blockType,
    fieldName, opt_value, opt_secondValue) {
  if (Blockly.Blocks[blockType]) {
    var firstValueField;
    var secondValueField;
    if (opt_value) {
      firstValueField = Blockly.VariableCategory.createValue(opt_value[0],
          opt_value[1], opt_value[2]);
    }
    if (opt_secondValue) {
      secondValueField = Blockly.VariableCategory.createValue(opt_secondValue[0],
          opt_secondValue[1], opt_secondValue[2]);
    }

    var gap = 10;
    var blockText = '<xml>' +
        '<block type="' + blockType + '" gap="' + gap + '">' +
        Blockly.Variables.generateVariableFieldXml_(variable, fieldName) +
        firstValueField + secondValueField +
        '</block>' +
        '</xml>';
    var block = Blockly.Xml.textToDom(blockText).firstChild;
    xmlList.push(block);
  }
};

/**
 * Create the text representation of a value dom element with a shadow of the
 *     indicated type inside.
 * @param {string} valueName Name of the value tags.
 * @param {string} type The type of the shadow tags.
 * @param {string|number} value The default shadow value.
 * @return {string} The generated dom element in text.
 */
Blockly.VariableCategory.createValue = function(valueName, type, value) {
  var fieldName;
  switch (valueName) {
    case 'ITEM':
      fieldName = 'TEXT';
      break;
    case 'INDEX':
      fieldName = 'NUM';
      break;
    case 'VALUE':
      if (type === 'math_number') {
        fieldName = 'NUM';
      } else if (type === 'variable') {
        return Blockly.Variables.generateVariableFieldXml_(value, valueName)
      } else {
        fieldName = 'TEXT';
      }
      break;
  }
  var valueField =
      '<value name="' + valueName + '">' +
      '<shadow type="' + type + '">' +
      '<field name="' + fieldName + '">' + value + '</field>' +
      '</shadow>' +
      '</value>';
  return valueField;
};

/**
 * Construct a block separator. Add the separator to the given xmlList.
 * @param {!Array.<!Element>} xmlList Array of XML block elements.
 */
Blockly.VariableCategory.addSep = function(xmlList) {
  var gap = 36;
  var sepText = '<xml>' +
      '<sep gap="' + gap + '"/>' +
      '</xml>';
  var sep = Blockly.Xml.textToDom(sepText).firstChild;
  xmlList.push(sep);
};
