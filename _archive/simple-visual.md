## SIMPLE VISUAL EDITOR - ULTRA MINIMAL

## GOAL
Activate the existing visual mode infrastructure with basic edge list display and Sigma.js node-based editing.

Specs:
1. only sync when switching modes
2. visual panel only shows:
- parsed input as uneditable list
- selected node & delete button
3. click node on graph to select then:
- click another node to add edge
- click empty space to add node & edge
- click delete button to remove selected node



## WHAT
Display edges: Show parsed edges as read-only list in existing #edge-list container
Node selection: Use existing Sigma.js node selection (already implemented)
Add edges: Extend existing clickNode handler for node-to-node edge creation
Add nodes: Extend existing clickStage handler for selected node + empty space
Delete: Replace "ADD EDGE" button with "DELETE SELECTED" functionality
Sync: Only when switching modes using existing ui.editorMode state

IMPORTANT: DO NOT IMPLEMENT MORE THAN THIS

## HOW
1. Create visual module - Single file js/ui/visual-editor.js (~50 lines)
2. Subscribe to mode changes - Use existing ui.editorMode state subscription
3. Populate edge list - Parse text input using existing parseEdgeInput() function
4. Extend click handlers - Modify existing Sigma.js handlers for edge creation
5. Replace button - Swap "ADD EDGE" for "DELETE SELECTED" in visual mode
6. Sync back - Format Sigma graph edges to text input on mode switch

## NEED
Existing infrastructure: Mode switching, containers, CSS, Sigma.js handlers (complete)
New file: js/ui/visual-editor.js (subscribe to state, sync data)
Modify: Extend click handlers in sigma-adapter.js for edge creation
Integration: Import in js/ui/init.js (1 line)

## IMPLEMENTATION

STEP 1: CREATE VISUAL MODULE COMPLETE
Do: Create js/ui/visual-editor.js with mode subscription and sync functions
Test: Console logs when switching to visual mode
Verify: console.log('Visual mode active:', mode === 'visual')
Status: COMPLETE & TESTED

STEP 2: DISPLAY EDGE LIST COMPLETE
Do: Parse text input and populate #edge-list with read-only edges
Test: Text [a,b],[b,c] → visual shows "a → b" and "b → c"
Verify: Empty input → empty list, invalid input → error message
Status: COMPLETE

STEP 3: EXTEND NODE CLICK HANDLER COMPLETE
Do: Add edge creation logic to existing clickNode in sigma-adapter.js
Test: Select node 'a' → click node 'b' → creates edge a→b in graph
Verify: Edge appears in Sigma visualization and updates on mode switch
Status: COMPLETE - Edge creation working in visual mode

STEP 4: EXTEND STAGE CLICK HANDLER COMPLETE  
Do: Add new node creation to existing clickStage when node selected
Test: Select 'a' → click empty space → creates new node + edge to 'a'
Verify: New node appears in graph with connection
Status: COMPLETE - Stage click creates node + edge to selected

STEP 5: REPLACE ADD EDGE BUTTON COMPLETE
Do: Change button text/function to "DELETE SELECTED" in visual mode
Test: Select node → click delete → node removed from graph
Verify: Connected edges also removed, changes sync to text
Status: COMPLETE - Button shows selection state and delete function

STEP 6: INTEGRATION TEST
Do: Full workflow with existing algorithms
Test: Build graph in visual → switch to text → run Euler calculation
Verify: All features work together, no console errors
Status: PENDING - Final integration test

## NEXT STEPS - ESSENTIAL IMPROVEMENTS

STEP 7: ENABLE NODE CREATION VIA STAGE CLICK
Problem: enableVisualCreation is set to false in sigma-controller.js
Do: Set visualFeatures.enableVisualCreation = true (line 39)
Test: Click empty space with NO selection → creates standalone node
Note: Already works WITH selection (Step 4), this enables without selection
Priority: HIGH - Essential for building graphs from scratch

STEP 8: ADD VISUAL FEEDBACK FOR INTERACTIONS
Problem: Users don't know what's clickable or what mode they're in
Do: Add CSS classes and cursor changes:
- Hover states for nodes (cursor: pointer)
- Different cursor when dragging vs selecting
- Highlight potential edge targets when node selected
Test: Visual cues appear on hover and during interactions
Priority: HIGH - Essential for usability

STEP 9: IMPLEMENT EDGE WEIGHT EDITING
Problem: Can see weights but can't edit them in visual mode
Do: Add inline weight input when edge selected:
- Click edge → show weight in button area
- Add number input to change weight
- Update graph and sync to text
Test: Select edge → edit weight → see update in graph
Priority: HIGH - Essential for weighted graphs

STEP 10: FIX BUTTON STATE MANAGEMENT
Problem: Button shows "SELECT NODE TO BEGIN" even when nodes are selectable
Do: Better state tracking in updateButtonContent():
- "Click a node or empty space" when nothing selected
- Show node name when selected
- Show edge info when edge selected
Test: Button text accurately reflects current state
Priority: MEDIUM - Important for clarity