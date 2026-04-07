## TODO:
1. mobile: lots of bugs and dodgy code with mobile layout still to fix as well as integration between the content and graph layers - ie how it should work with 2 seperate tabs as opposed to desktop you can see both always
2. debloat: massive amounts of bloat all over cosebase to be removed, way overengineerd stuff to be simplified
3. refactor files and general cleanup & optimise
4. visual editor & input validation
6. incorporate some simplified elemets of orbital (color?) back into new layout
7. fix notificaition system after it broke from new layout
8. desktop sidebar: need to fix logo/title and create expand retract thing that aligns with what is in mobile

- [ ] change nodes/edges colours & styling to be better (thicker)

help and tooltips


- [ ] theme implementation with minimilist/academic option

zoom in expand view option





----------------------------------
BUNCH OF BOLLOCKS BELOW, ALL OF THE BELOW TEXT IS BOLLOCKS:
----------------------------------


## Orbital Controls
**Status**: Significantly simplified
**Details**: Original had proper circular positioning, responsive layout, and selection indicator.
**Why Simplified**: The SVG-based positioning and calculations were complex.
**Better Implementation**: Use SVG for controls with proper transformations for positioning. CSS custom properties for angles is cleaner than the original approach.

## Validation and Syntax Checking
**Status**: Simplified
**Details**: Original had more thorough validation of edge input with syntax highlighting.
**Why Simplified**: Validation logic was scattered across multiple files.
**Better Implementation**: Centralized validation module with proper error reporting. Consider a parser generator like PEG.js for the edge list syntax.

## Error Notifications
**Status**: Partially implemented
**Details**: Original had more contextual error messages and visual cues.
**Why Simplified**: UI for errors was tangled with other code.
**Better Implementation**: Error boundary component with standardized notification system.

## Animation Controls
**Status**: Simplified
**Details**: Original had more playback controls for animations.
**Why Simplified**: Animation logic was tightly coupled with other components.
**Better Implementation**: Separate animation controller with proper state management.


## Edge Weight Handling
**Status**: Simplified
**Details**: Better UI for displaying and editing edge weights.
**Why Simplified**: Weight UI was mixed with general edge handling.
**Better Implementation**: Dedicated component for weight visualization/editing.

## Algorithm Explanation
**Status**: Simplified
**Details**: More detailed explanations of the Euler path algorithm.
**Why Simplified**: Text was hard-coded in various places.
**Better Implementation**: Structured explanation data with markdown support.




### Algorithmic Stuff
- [ ] Modify to include more types, bfs and etc

### General improvements
- [ ] Handle weight values (incl default to 1 if left blank)
- [ ] Create keyboard controls (arrow keys)