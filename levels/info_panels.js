function displayViewsPanel() {
    document.write(`
        <div id="views-panel">
            <table class="views">
                <tr>
                    <td>
                        View:
                        <select id="view">
                            <option value="fixed">Fixed</option>
                            <option value="first">First-person</option>
                            <option value="third">Third-person</option>
                            <option value="top">Top</option>
                        </select>
                    </td>
                    <td>
                        Orientation (h):
                        <input type="number" id="horizontal" required>
                    </td>
                    <td>
                        Orientation (v):
                        <input type="number" id="vertical" required>
                    </td>
                    <td>
                        <input type="button" id="reset" value="Reset view">
                    </td>
                </tr>
                <tr>
                    <td>
                        Projection:
                        <select id="projection">
                            <option value="perspective">Perspective</option>
                            <option value="orthographic">Orthographic</option>
                        </select>
                    </td>
                    <td>
                        Distance:
                        <input type="number" id="distance" required>
                    </td>
                    <td>
                        Zoom:
                        <input type="number" id="zoom" required>
                    </td>
                    <td>
                        <input type="button" id="reset-all" value="Reset all views">
                    </td>
                </tr>
            </table>
        </div>
            `);
}

function displayMouseHelpPanel() {
    document.write(`
<div id="mouse-help-panel">
            <table class="mouse-help" id="mouse-help-table">
                <tr>
                    <th colspan="5" style="font-size: 2.0vmin">
                        Help - Mouse
                    </th>
                </tr>
                <tr>
                    <th>View</th>
                    <th>Primary button</th>
                    <th>Secondary button</th>
                    <th>Shift-wheel</th>
                    <th>Wheel</th>
                </tr>
                <tr>
                    <td>Fixed</td>
                    <td>Drag / resize</td>
                    <td>Orbit</td>
                    <td>Dolly</td>
                    <td>Zoom</td>
                </tr>
                <tr>
                    <td>First-person</td>
                    <td>Drag / resize</td>
                    <td>Orbit</td>
                    <td>n/a</td>
                    <td>Zoom</td>
                </tr>
                <tr>
                    <td>Third-person</td>
                    <td>Drag / resize</td>
                    <td>Orbit</td>
                    <td>Dolly</td>
                    <td>Zoom</td>
                </tr>
                <tr>
                    <td>Top</td>
                    <td>Drag / resize</td>
                    <td>Orbit</td>
                    <td>Dolly</td>
                    <td>Zoom</td>
                </tr>
                <tr>
                    <td>Mini-map</td>
                    <td>Drag / resize</td>
                    <td>Pan</td>
                    <td>n/a</td>
                    <td>Zoom</td>
                </tr>
            </table>
        </div>
    `);
}

function displayKeyboardHelpPanel() {
    document.write(`
    <div id="keyboard-help-panel">
            <table class="keyboard-help" id="keyboard-help-table">
                <tr>
                    <th colspan="2" style="font-size: 2.0vmin">
                        Help - Keyboard
                    </th>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left">Set view mode</th>
                </tr>
                <tr>
                    <td></td>
                    <td>Stabilized view mode / realistic view mode</td>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left">Display / select / hide views</th>
                </tr>
                <tr>
                    <td></td>
                    <td>Fixed view</td>
                </tr>
                <tr>
                    <td></td>
                    <td>First-person view</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Third-person view</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Top view</td>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left">Display / hide subwindows and bounding volumes</th>
                </tr>
                <tr>
                    <td></td>
                    <td>Mini-map</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Statistics</td>
                </tr>
                <tr>
                    <td></td>
                    <td>User interface</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Help and credits</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Bounding volumes</td>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left">Turn on / off lights, shadows and fog
                    </th>
                </tr>
                <tr>
                    <td></td>
                    <td>Ambient light</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Directional light</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Spotlight</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Flashlight</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Shadows</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Fog</td>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left">Move character</th>
                </tr>
                <tr>
                    <td></td>
                    <td>Turn left slowly / quickly (with shift key)</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Turn right slowly / quickly (with shift key)</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Walk / run (with shift key) backward</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Walk / run (with shift key) forward</td>
                </tr>
                <tr>
                    <th colspan="2" style="text-align: left">Emote character</th>
                </tr>
                <tr>
                    <td></td>
                    <td>Jump</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Yes</td>
                </tr>
                <tr>
                    <td></td>
                    <td>No</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Wave</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Punch</td>
                </tr>
                <tr>
                    <td></td>
                    <td>Thumbs up</td>
                </tr>
            </table>
        </div>
    `);
}

function displayCreditsPanel() {
    document.write(`
        <div id="credits-panel">
            <table class="credits" id="credits-table">
                <tr>
                    <th style="font-size: 2.0vmin">
                        Credits
                    </th>
                </tr>
                <tr>
                    <td></td>
                </tr>
            </table>
        </div>
    `);
}

function displaySubWindowsPanel() {
    document.write(`
    <div id="subwindows-panel">
            <table class="subwindows">
                <tr>
                    <td>
                        Realistic view mode:
                        <input type="checkbox" id="realistic">
                    </td>
                </tr>
                <tr>
                    <td>
                        Fixed view:
                        <input type="checkbox" id="fixed">
                    </td>
                </tr>
                <tr>
                    <td>
                        First-person view:
                        <input type="checkbox" id="first-person">
                    </td>
                </tr>
                <tr>
                    <td>
                        Third-person view:
                        <input type="checkbox" id="third-person">
                    </td>
                </tr>
                <tr>
                    <td>
                        Top view:
                        <input type="checkbox" id="top">
                    </td>
                </tr>
                <tr>
                    <td>
                        Mini-map:
                        <input type="checkbox" id="mini-map">
                    </td>
                </tr>
                <tr>
                    <td>
                        Statistics:
                        <input type="checkbox" id="statistics">
                    </td>
                </tr>
                <tr>
                    <td>
                        User interface:
                        <input type="checkbox" id="user-interface">
                    </td>
                </tr>
                <tr>
                    <td>
                        Help and credits:
                        <input type="checkbox" id="help">
                    </td>
                </tr>
            </table>
        </div>
        `);


}