"""Generates the case-study (projects/) and tool detail (tools/) pages.

Run from the repository root:  python scripts/build_pages.py
Edit the PROJECTS / TOOLS data below, then re-run.
"""
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;650;700;750'
         '&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">')
ICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' "
        "height='32' rx='6' fill='%231F4788'/%3E%3Cpath d='M6 24 L16 8 L26 24 Z M11 24 L16 16 L21 24' fill='none' "
        "stroke='white' stroke-width='2.2' stroke-linejoin='round'/%3E%3C/svg%3E")
LOGO = ('<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="6" fill="#1F4788"/>'
        '<path d="M6 24 L16 8 L26 24 Z M11 24 L16 16 L21 24" fill="none" stroke="#fff" stroke-width="2.2" '
        'stroke-linejoin="round"/></svg>')

# --------------------------------------------------------------------------------------------
# Content. Text values are trusted HTML (they may contain <b>, <i>, entities).
# A figure is (file, caption) or (file, caption, "wide"); .mp4 files render as video.
# --------------------------------------------------------------------------------------------

PROJECTS = [
    dict(
        slug="meinhardt-pile-raft",
        kicker="Meinhardt · Structural design",
        title="Pile-raft foundation &amp; long-span steel truss",
        summary="Eurocode design of a nonlinear pile-raft foundation and footfall-vibration checks on a long-span steel truss, backed by in-house automation for reviewing results.",
        meta=[("Firm", "Meinhardt"), ("Role", "Structural Engineer"), ("Codes", "EN 1990 · EN 1997 · EN 1998"), ("Software", "ETABS · Excel VBA")],
        hero=None,
        sections=[
            ("Challenge", """
<p>A pile-raft shares load between the raft bearing on soil and the piles, so the foundation forces depend on the relative stiffness of soil, piles and superstructure. The design also had to cover Eurocode seismic and uplift (UPL) combinations, where some piles may go into tension.</p>
<p>Separately, a long-span steel truss needed to be checked for walking-induced vibration, where the governing criterion is user comfort rather than strength.</p>"""),
            ("Approach", """
<ul>
<li><b>Soil–structure interaction.</b> Built a nonlinear ETABS model with point springs for the piles, area springs for the raft subgrade and rigid diaphragms, so pile and raft reactions follow their relative stiffness.</li>
<li><b>Load combinations.</b> Set up EN 1997 Design Approach 1 (DA1-C1 and DA1-C2), seismic and UPL combinations.</li>
<li><b>Run time.</b> Iterated on the nonlinear model to keep analysis time workable across many combinations.</li>
<li><b>Footfall vibration.</b> Checked the 3D truss model for peak acceleration against a 5%g limit and for the RMS-based response factor R.</li>
</ul>"""),
            ("Automation", """
<p>Reviewing reactions and utilisation for hundreds of piles by table is slow and error-prone. I built an Excel VBA toolset that plots pile reactions and utilisation ratios as multi-module bubble charts on plan, with one-click PDF export for review and reporting.</p>"""),
            ("Outcome", """
<div class="callout"><p>A foundation model that captures pile–raft load sharing under the full Eurocode combination set, a documented footfall check for the truss, and a reusable visual review tool for pile results.</p></div>"""),
        ],
        tags=["EN 1997 DA1", "EN 1998", "Nonlinear springs", "Footfall", "ETABS", "VBA"],
    ),
    dict(
        slug="shellharbour-hospital",
        kicker="Aurecon · Healthcare · CD phase",
        title="Shellharbour Hospital",
        summary="Diaphragm design for the whole hospital in ETABS, with drafting mark-ups, drawing QA/QC and reinforcement tracking during construction documentation.",
        meta=[("Firm", "Aurecon"), ("Role", "Structural Engineer"), ("Phase", "Construction documentation"), ("Software", "ETABS · Bluebeam · Revit")],
        hero=("shell-render.jpg", "Shellharbour Hospital — project render"),
        sections=[
            ("Scope", """
<p>Responsible for the floor diaphragm design across the entire project during the construction-documentation phase, from analysis through to reinforcement on the drawings.</p>"""),
            ("Approach", """
<ul>
<li><b>Analysis.</b> Extracted diaphragm forces from the ETABS model to identify load paths, transfer zones and areas needing additional reinforcement.</li>
<li><b>Documentation.</b> Prepared Bluebeam mark-ups for the drafting team and carried out QA/QC on the final drawings.</li>
<li><b>Cost control.</b> Monitored reinforcement quantities so the site team had reliable figures for pricing.</li>
<li><b>Change tracking.</b> Worked with the BIM team in Revit to set up a workflow that continuously tracks design changes between model and drawings.</li>
</ul>"""),
            ("Figures", None),
            ("Outcome", """
<div class="callout"><p>A diaphragm design documented consistently across the project, with checked drawings, tracked reinforcement quantities and a change-tracking workflow shared with the BIM team.</p></div>"""),
        ],
        figs=[("shell-diaphragm.jpg", "Diaphragm force contours from ETABS", "wide"),
              ("shell-markup.jpg", "Reinforcement mark-up for drafting", "wide")],
        tags=["Diaphragm design", "ETABS", "Bluebeam", "Revit", "QA/QC"],
    ),
    dict(
        slug="4th-broadway",
        kicker="Thornton Tomasetti · High-rise · CD phase",
        title="4th Broadway",
        summary="A 368 ft mixed-use concrete tower — seismic column design to ACI 318 and mat foundation design in SAFE.",
        meta=[("Firm", "Thornton Tomasetti"), ("Building", "368 ft tower, 292,000 GSF"), ("Codes", "ASCE 7-16 · ACI 318-14 · CBC"), ("Software", "ETABS · SAFE · spreadsheets")],
        hero=("tb-render.jpg", "4th Broadway — tower render"),
        sections=[
            ("Project", """
<p>Offices on levels 3–7, a 304-room hotel on levels 9–30, an urban park at ground level, rooftop patios on levels 3 and 9, a pool and bar on level 31 and banquet space on level 32. Two basement levels for parking extend 24 ft below grade; the tower rises 368 ft plus a 32 ft mechanical penthouse.</p>"""),
            ("Column design", """
<ul>
<li><b>Gravity.</b> Estimated column forces by tributary area and validated them against ETABS. Used an in-house spreadsheet to find good starting sizes under axial load and to avoid slender columns.</li>
<li><b>Seismic.</b> Designed tower and podium columns for the moments and shears induced by design earthquake displacements (ACI 318-14 §18.4.3.2 and §18.14.3.3), with transverse reinforcement detailed for ductility and confinement.</li>
<li><b>Slab–column connections.</b> Provided the minimum requirements of ACI 318-14 §18.14.5.1 so connections stay effective under large drifts.</li>
<li><b>Verification.</b> Built hand-calculation spreadsheets to check the software results.</li>
</ul>"""),
            ("Mat foundation", """
<ul>
<li>Designed the mat in CSI SAFE.</li>
<li>Checked soil bearing pressure under the service combinations of CBC alternate equations 16-21 and 16-22.</li>
<li>Designed flexural and shear reinforcement for the ultimate combinations (ASCE 7 equations 6 and 7).</li>
</ul>"""),
            ("Figures", None),
        ],
        figs=[("tb-section.jpg", "Building section and programme"), ("tb-etabs.jpg", "ETABS analysis model"),
              ("tb-pmm.jpg", "Column P–M interaction check"), ("tb-mat.jpg", "Mat foundation bearing pressure (SAFE)")],
        tags=["ASCE 7-16", "ACI 318-14", "CBC", "Seismic columns", "Mat foundation", "ETABS", "SAFE"],
    ),
    dict(
        slug="sdc-belmont",
        kicker="Thornton Tomasetti · Data center · DD phase",
        title="SDC Belmont Data Center",
        summary="My first solo project: gravity, lateral and pile design for a composite-steel data center with a column-free data hall.",
        meta=[("Firm", "Thornton Tomasetti"), ("Role", "Lead engineer (first solo project)"), ("Codes", "ASCE 7-16 · ACI 318-19 · AISC 360-16"), ("Software", "RAM SS · ETABS · Excel")],
        hero=("sdc-render.jpg", "SDC Belmont Data Center — render"),
        sections=[
            ("Structural system", """
<p>The administration platform uses composite steel framing with a column-free data hall: roughly 54 ft spans on 30 ft bays, with a single central column line in the aisle. The equipment platform has 36 × 34 ft bays; other areas span up to 40 ft.</p>
<ul>
<li><b>Gravity:</b> composite slab and metal grating on orthogonal steel and composite beams.</li>
<li><b>Lateral:</b> concrete-on-metal-deck diaphragms delivering wind and seismic loads to HSS braced frames.</li>
</ul>"""),
            ("Approach", """
<ul>
<li><b>Gravity framing.</b> Hand-calculated one representative bay, accounting for the architecture and mechanical equipment weights, to set initial sizes; then sized all gravity beams and columns in RAM Structural System.</li>
<li><b>Lateral system.</b> Sized every braced frame in ETABS, designed the slab-on-deck diaphragms, and designed in-plane trusses that act as the equipment-platform diaphragm between brace lines.</li>
<li><b>Piles.</b> Sized all piles for the bidding package and produced a visual pile map — location, diameter and estimated capacity — to coordinate design with drawing production.</li>
<li><b>Verification.</b> Hand-calculation spreadsheets to validate software results.</li>
</ul>"""),
            ("Figures", None),
        ],
        figs=[("sdc-model.jpg", "Administration and equipment platforms"), ("sdc-ram.jpg", "Gravity framing in RAM SS"),
              ("sdc-braces.jpg", "Braced frame layout"), ("sdc-piles.jpg", "Pile layout for bidding")],
        tags=["Composite steel", "HSS braced frames", "Diaphragms", "Piles", "RAM SS", "ETABS"],
    ),
    dict(
        slug="apple-capstone",
        kicker="Thornton Tomasetti · Office campus · CD / CA phase",
        title="Apple Capstone Campus, Austin",
        summary="Construction administration for 900,000 sq ft of post-tensioned concrete offices — and the dashboards and macros that kept the review team on schedule.",
        meta=[("Firm", "Thornton Tomasetti"), ("Role", "Structural Engineer, CA team lead"), ("Scale", "900,000 sq ft"), ("Tools", "Bluebeam · Power BI · Excel VBA")],
        hero=("apple-render.jpg", "Apple Capstone Campus — aerial render"),
        sections=[
            ("Project", """
<p>Low-rise concrete office buildings with 50 ft post-tensioned girders for gravity framing and moment frames as the lateral force-resisting system.</p>"""),
            ("Construction administration", """
<ul>
<li>Reviewed shop drawings and answered RFIs, making sure structural details were clear to the builders.</li>
<li>Managed a small team — distributing work fairly and checking the quality of each review.</li>
<li>Kept close contact with the on-site engineer so construction deadlines were met.</li>
</ul>"""),
            ("Process improvement", """
<ul>
<li><b>Submittal dashboard.</b> Built a Power BI dashboard to track submittal status and team workload.</li>
<li><b>Workbook automation.</b> Refactored hand-calculation workbooks in VBA to automate repetitive tasks such as printing and data handling.</li>
</ul>"""),
            ("Figures", None),
        ],
        figs=[("apple-powerbi.jpg", "Power BI submittal and workload tracker", "wide")],
        tags=["Construction administration", "Shop drawings", "RFIs", "Power BI", "VBA"],
    ),
]

TOOLS = [
    dict(
        slug="mcotis",
        kicker="Desktop app · C# / .NET 8 · own FEM solver",
        title="Mcotis",
        summary="Automated structural optimisation for cable-supported and tied-arch transfer structures — a parametric FEM workflow that evaluates design alternatives and compares them on tonnage and cost.",
        meta=[("Type", "WPF desktop application"), ("Stack", "C# · .NET 8 · in-house FEM"), ("Interop", "SAP2000 / ETABS import–export"), ("Status", "Active development")],
        hero=("mcotis-moment.jpg", "ULS bending moment envelope"),
        problem="Choosing the depth of a transfer truss and the pretension of its cables is a coupled problem: each choice changes member forces, deflection and column demand. Doing this by hand in SAP2000 means building, running and post-processing one model per option, so only a handful of options are ever compared.",
        method="""<ul>
<li><b>Candidate generation.</b> The engineer defines ranges for loading, truss height and cable pretension; Mcotis builds every combination as a candidate.</li>
<li><b>Analysis.</b> Each candidate is analysed by an in-house FEM solver with tension-only cables, benchmarked against SAP2000, so no external solver licence is needed.</li>
<li><b>Design.</b> Steel, CFT, encased and mega composite columns are checked and optimised over section ranges.</li>
<li><b>Comparison.</b> Material quantities and estimated cost are reported per candidate.</li>
</ul>""",
        result="Design teams can compare a full grid of truss depths and cable pretensions on deflection, member utilisation, tonnage and cost in one run, instead of a few hand-built models.",
        impl="""<ul>
<li>WPF / .NET 8 desktop application with a single-window document workflow.</li>
<li>In-house frame and cable FEM solver; SAP2000 and ETABS kept only as import/export utilities.</li>
<li>Verification suite comparing solver results against SAP2000 benchmarks.</li>
</ul>""",
        figs=[("mcotis-3d.jpg", "3D extruded model"), ("mcotis-deflection.jpg", "SLS deflection contour"),
              ("mcotis-mega.jpg", "Mega composite column section", "wide"), ("mcotis-qto.jpg", "Material quantities and estimated cost", "wide")],
        links=[],
        tags=["FEM", "Optimisation", "Cables", "Composite columns", "C#", ".NET 8"],
    ),
    dict(
        slug="bridger",
        kicker="Desktop app · .NET 8 · ETABS API",
        title="Bridger",
        summary="Moves parts of one ETABS model into another — geometry, names, assignments and definitions intact — and verifies every value against the target model.",
        meta=[("Type", "WPF desktop application"), ("Stack", "C# · .NET 8 · ETABS API"), ("Tested on", "ETABS 22.7"), ("Output", "Migration log (.log / .jsonl)")],
        hero=("bridger-ui.jpg", "Bridger — connections, migration options and execution log"),
        problem="Design teams often develop parts of a building in separate ETABS models and later need to merge them. Copying objects by hand loses unique names and assignments, and re-applying sections, releases, springs, loads and labels is slow and easy to get wrong.",
        method="""<ul>
<li><b>Connect.</b> Attach to two running ETABS instances (source and target), found by process and attached by PID.</li>
<li><b>Select.</b> Pick joints, frames and shells in Model A and tick the categories to migrate.</li>
<li><b>Migrate in stages.</b> Geometry and names → section definitions → assignments → loading → pier and spandrel labels → design overwrites.</li>
<li><b>Fixed rules, no prompts.</b> Each situation — no match, one match, several matches, name taken — has a defined behaviour; skipped items are logged.</li>
<li><b>Verify.</b> Every value is read back from Model B and compared before the model is refreshed.</li>
</ul>""",
        result="Model merges become repeatable and auditable: what was copied, reused, renamed or skipped is recorded in a log rather than relying on manual checks.",
        impl="""<ul>
<li>.NET 8 WPF application compiled against the ETABS API.</li>
<li>Load patterns, cases (including nonlinear static, staged construction and time history) and combinations migrate with the functions and mass sources they depend on.</li>
<li>Live test suite drives two ETABS instances and regenerates a capability matrix of verified categories.</li>
</ul>""",
        figs=[], links=[], tags=["ETABS API", "Model migration", "Verification", "C#", ".NET 8"],
    ),
    dict(
        slug="pdfetabs-column-mapper",
        kicker="Desktop app · ETABS API · PDF markups",
        title="PDFETABS Column Mapper",
        summary="Faster, more reliable column naming for CORENET X submissions — matches PDF markup tags to ETABS columns and gives engineers a visual QA/QC overlay before names are written back.",
        meta=[("Type", "Desktop application"), ("Inputs", "Marked-up PDF · running ETABS model"), ("Use case", "CORENET X naming phase"), ("Output", "ETABS names, pier labels, report")],
        hero=None,
        problem="For CORENET X submission, column names in the analysis model must match the drawings exactly. Renaming hundreds of columns by hand from marked-up PDFs is slow, and a single mismatch between drawing and model creates rework at submission.",
        method="""<ul>
<li><b>Read both sources.</b> Column tags and page scale come from the marked-up PDF; columns by story come from ETABS through the API.</li>
<li><b>Common origin.</b> The engineer pins one PDF tag to one ETABS constraint column so both sets share a local frame.</li>
<li><b>Geometric matching.</b> Each ETABS column searches for PDF tags within a set radius and is classified as Match, Ambiguous, No match or Conflict.</li>
<li><b>Review.</b> An overlay chart and column inspector show every pairing; engineers can overwrite manually.</li>
<li><b>Write back.</b> Names are applied with a two-pass rename and pier labels are assigned; a report is exported for QA/QC.</li>
</ul>""",
        result="Naming becomes a visual check rather than a manual transcription: discrepancies between drawings and model are visible before anything is written to ETABS.",
        impl="""<ul>
<li>ETABS API for reading columns by story and writing names and pier labels.</li>
<li>PDF annotation parsing with page and scale handling.</li>
<li>Interactive overlay chart with search radii, match lines and status filtering.</li>
</ul>""",
        figs=[("pdfetabs-flow.svg", "Workflow"), ("pdfetabs-before.jpg", "Before — PDF tags (orange) over ETABS columns (blue)"),
              ("pdfetabs-after.jpg", "After — matched pairs within the search radius", "wide"),
              ("pdfetabs-column-mapper.mp4", "Demo at 2× speed with idle time removed. File paths blurred.", "wide")],
        links=[], tags=["CORENET X", "ETABS API", "PDF", "QA/QC"],
    ),
    dict(
        slug="mcalccanvas",
        kicker="Web app · TypeScript · React",
        title="MCalcCanvas",
        summary="A browser-based engineering calculation platform combining unit-aware equations, structural design templates and editable technical reports.",
        meta=[("Type", "Web application"), ("Stack", "TypeScript · React · own canvas engine"), ("Output", "Vector PDF calculation sheets"), ("Status", "Live")],
        hero=("mcalc-column.jpg", "RC rectangular column check (EC2)"),
        problem="Engineering calculations are usually written in spreadsheets, which hide the equations, or in desktop math tools that are licensed per seat. Reviewers need to see the formula, the units and the result together.",
        method="""<ul>
<li><b>Free canvas.</b> Equations and text are placed anywhere on A4 pages with an engineering grid, like a hand calculation.</li>
<li><b>Live, unit-aware engine.</b> Variables carry units; changing an input updates every dependent result.</li>
<li><b>Templates.</b> RC beams and columns (EC2), steel beams and beam-columns (EC3) and composite beams (EC4).</li>
<li><b>Reports.</b> Title block, outline and parameter panel, exported as vector PDF.</li>
</ul>""",
        result="Calculations that read like hand calcs but recalculate like software, shareable as a link and exportable as a clean PDF report. MCalcCanvas also opens the reports produced by mCompositeBeamDesign and MBColumn Lite for customising and review.",
        impl="""<ul>
<li>React + TypeScript with a custom canvas engine and math input.</li>
<li>Unit-aware evaluation engine; worksheets autosave in the browser.</li>
<li>Unit tests for the engine and serializer; browser acceptance tests with Playwright.</li>
</ul>""",
        figs=[("mcalc-steel.jpg", "Simply supported steel beam worksheet"), ("mcalc-pdf.jpg", "Exported PDF — steel beam-column check (EC3)"),
              ("mcalc-ec4.jpg", "Composite beam (EC4) worksheet overview", "wide")],
        links=[("Open live app", "https://anhbq1298.github.io/mCalcCanvas/"), ("Source on GitHub", "https://github.com/Anhbq1298/mCalcCanvas")],
        tags=["TypeScript", "React", "Units", "EC2", "EC3", "EC4", "PDF"],
    ),
    dict(
        slug="mcompositebeamdesign",
        kicker="Web app · TypeScript · MCalcCanvas engine",
        title="mCompositeBeamDesign",
        summary="Composite beam design to EN 1994-1-1 in the browser — every check traced to its clause, with the full report editable in MCalcCanvas.",
        meta=[("Type", "Web application"), ("Code", "EN 1994-1-1 / EN 1993-1-1"), ("Engine", "MCalcCanvas"), ("Status", "Live (review draft)")],
        hero=("composite-ui.jpg", "Inputs, loading diagrams, plastic stress block and check list"),
        problem="Composite beam design spans two stages (construction and composite), many clauses and several failure modes. Spreadsheet tools give a pass/fail number but rarely show where it comes from, which makes checking slow.",
        method="""<ul>
<li><b>Inputs.</b> Steel section from a library (uniform or tapered), slab type (solid or profiled deck), materials, partial factors and loads.</li>
<li><b>Checks.</b> Bending, shear, lateral-torsional buckling, shear connection, web under point loads, transverse slab reinforcement and deflection — each with its clause, location and utilisation.</li>
<li><b>Visuals.</b> Longitudinal section, load diagrams and the plastic stress block at the critical section.</li>
<li><b>Report.</b> One click opens the full calculation in MCalcCanvas for editing and PDF export.</li>
</ul>""",
        result="Engineers see the governing check, its clause and its location at a glance, and can hand reviewers a full, editable calculation instead of a spreadsheet.",
        impl="""<ul>
<li>TypeScript front end running on the MCalcCanvas engine; every result is a worksheet equation.</li>
<li>Independent reference calculations used to pin numerical results in unit tests.</li>
</ul>""",
        figs=[("composite-report.jpg", "The same design opened as an editable MCalcCanvas report", "wide")],
        links=[("Open live app", "https://anhbq1298.github.io/mCalcCanvas/composite/")],
        tags=["EN 1994-1-1", "Composite beams", "TypeScript", "MCalcCanvas"],
    ),
    dict(
        slug="mbcolumn-lite",
        kicker="Web app · TypeScript",
        title="MBColumn Lite",
        summary="Rectangular RC column design to Eurocode 2 in the browser — a fibre-based 3D PMM surface solved in seconds, with reports editable in MCalcCanvas.",
        meta=[("Type", "Web application"), ("Code", "EN 1992-1-1"), ("Method", "Fibre section, 3D PMM"), ("Status", "Live")],
        hero=("mbclite-pmm.jpg", "3D PMM surface, capacity check, P–M and Mx–My diagrams"),
        problem="Checking biaxially loaded columns needs the full P–Mx–My capacity surface. Commercial tools are licensed per seat, and quick spreadsheets usually simplify biaxial bending.",
        method="""<ul>
<li><b>Section editor.</b> Draw and drag bars on a grid canvas, edit coordinates in a table, or set bars by face.</li>
<li><b>Fibre analysis.</b> The section is meshed into concrete fibres and bars; the solver builds the 3D PMM surface.</li>
<li><b>Checks.</b> Multiple load cases with demand/capacity ratios, P–M and Mx–My diagrams, and optional EC2 §5.8 slenderness.</li>
<li><b>Report.</b> Results export to a report that opens in MCalcCanvas.</li>
</ul>""",
        result="A free, browser-based biaxial column check that solves in seconds and produces a reviewable report.",
        impl="""<ul>
<li>TypeScript web app; the solver runs in a background worker so the interface stays responsive.</li>
<li>Interactive 3D surface with load-case points, governing ray and capacity contours.</li>
</ul>""",
        figs=[("mbclite-ui.jpg", "Section editor, materials and load cases", "wide")],
        links=[("Open live app", "https://mbcolumnlite.netlify.app/")],
        tags=["EN 1992-1-1", "PMM", "Fibre section", "TypeScript"],
    ),
    dict(
        slug="sp-editor",
        kicker="Desktop tool · Python · ETABS API · award-winning",
        title="SP-Editor",
        summary="Award-winning automation of shear-wall design input — extracts ETABS pier geometry and forces and generates spColumn files in batch.",
        meta=[("Type", "Desktop tool"), ("Stack", "Python · PySide · ETABS API"), ("Award", "CORE studio R&amp;D 2024 Cycle 1, Thornton Tomasetti"), ("Demo", "YouTube")],
        hero=("sp-ui.jpg", "SP-Editor interface"),
        problem="Shear-wall design in spColumn needs geometry and design forces for every pier, transcribed by hand from ETABS. On large buildings this is hours of manual work in the middle of the design process.",
        method="""<ul>
<li>Extract wall-pier geometry and retrieve and filter pier design forces through the ETABS API.</li>
<li>Take the engineer's reinforcement pattern as input.</li>
<li>Run batch processing and export demand/capacity results.</li>
<li>Generate spColumn files for detailed design in later phases (100% DD or CD).</li>
</ul>""",
        result="Removed the manual transcription step between ETABS and spColumn. The project received an award from CORE studio in Thornton Tomasetti's R&amp;D 2024 Cycle 1.",
        impl="""<ul>
<li>Python with a PySide interface and SQL storage.</li>
<li>ETABS API for geometry and force extraction; spColumn file generation.</li>
</ul>""",
        figs=[("sp-flow.jpg", "Workflow", "wide")],
        links=[("Watch demo on YouTube", "https://www.youtube.com/watch?v=ujFrALC1rHs")],
        tags=["Python", "ETABS API", "spColumn", "Shear walls", "Award"],
    ),
    dict(
        slug="mgt",
        kicker="Grasshopper plugin · C# · Python",
        title="MGT",
        summary="Parametric modelling for ETABS and SAP2000 — Grasshopper components that build, edit, query and load structural models straight from Rhino geometry.",
        meta=[("Type", "Grasshopper 8 plugin"), ("Stack", "C# · GHPython · CSI API"), ("Targets", "ETABS · SAP2000 · Excel"), ("Demo", "YouTube playlist")],
        hero=("mgt-toolbar.jpg", "MGT toolbar — units, materials, loadings, point, frame, shell and cable objects, utilities"),
        problem="Architectural geometry lives in Rhino, analysis lives in ETABS or SAP2000. Rebuilding irregular geometry in the analysis model, and keeping it in sync as the design changes, is slow and repetitive.",
        method="""<ul>
<li><b>CSI link.</b> Components wrap the ETABS and SAP2000 APIs to set up, edit, query and load models from Grasshopper, and export data trees to Excel.</li>
<li><b>Grillage builder.</b> Turns slab boundaries into a strut-and-tie grillage model by conditionally sorting the Grasshopper data tree.</li>
<li><b>Tributary take-down.</b> Voronoi-based tributary areas for irregular wall and column layouts from cleaned CAD data.</li>
</ul>""",
        result="Analysis models are generated and updated parametrically from the design geometry instead of being redrawn by hand.",
        impl="""<ul>
<li>Grasshopper 8 plugin in C#, organised by component family (units, materials, loadings, points, frames, shells, cables, utilities).</li>
<li>Python 3 components for data-tree processing.</li>
<li>Compatibility and domain tests; example definitions shipped with the plugin.</li>
</ul>""",
        figs=[("gh-grillage.jpg", "Grillage strut-and-tie model from slab geometry"), ("gh-trib.jpg", "Voronoi tributary areas")],
        links=[("Watch MGT on YouTube", "https://www.youtube.com/playlist?list=PLP4F5t1phy2g")],
        tags=["Grasshopper", "Rhino", "ETABS API", "SAP2000 API", "C#", "Python"],
    ),
]

# --------------------------------------------------------------------------------------------


def head(title, desc):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Quang Anh (Mark) Bui</title>
<meta name="description" content="{escape(desc, quote=True)}">
{FONTS}
<link rel="icon" href="{ICON}">
<link rel="stylesheet" href="../assets/site.css">
</head>
<body>
<nav class="top" aria-label="Main">
  <div class="wrap">
    <a class="brand" href="../index.html">{LOGO}Mark Bui</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <div class="links" id="nav-links">
      <a href="../index.html#about">About</a>
      <a href="../index.html#experience">Experience</a>
      <a href="../index.html#tools">Tools &amp; R&amp;D</a>
      <a href="../index.html#contact">Contact</a>
    </div>
  </div>
</nav>
"""


FOOT = """
<footer>
  <div class="wrap">
    <span>© <span id="yr">2026</span> Quang Anh (Mark) Bui</span>
    <button class="theme-btn" id="theme">Toggle theme</button>
  </div>
</footer>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Image viewer">
  <button aria-label="Close">×</button>
  <img alt="">
  <p></p>
</div>
<script src="../assets/site.js"></script>
</body>
</html>
"""


def strip_tags(t):
    import re
    return re.sub(r"<[^>]+>", "", t).replace("&amp;", "&")


def fig_html(f):
    file, cap = f[0], f[1]
    wide = len(f) > 2
    cls = ' class="wide"' if wide else ""
    if file.endswith(".mp4"):
        poster = "../assets/pdfetabs-poster.jpg"
        inner = (f'<video controls muted playsinline preload="metadata" poster="{poster}">'
                 f'<source src="../assets/{file}" type="video/mp4"></video>')
    else:
        inner = (f'<button data-full="../assets/{file}" data-cap="{escape(strip_tags(cap), quote=True)}">'
                 f'<img src="../assets/{file}" alt="{escape(strip_tags(cap), quote=True)}" loading="lazy"></button>')
    return f'<figure{cls}>{inner}<figcaption>{cap}</figcaption></figure>'


def figs_block(figs):
    if not figs:
        return ""
    return '<div class="figs">' + "".join(fig_html(f) for f in figs) + "</div>"


def anchor(name):
    return name.lower().replace(" ", "-").replace("&amp;", "and").replace("/", "")


def page(item, kind, prev_item, next_item, back_href, back_label):
    meta = "".join(f"<div><dt>{k}</dt><dd>{v}</dd></div>" for k, v in item["meta"])
    hero = ""
    if item.get("hero"):
        f, cap = item["hero"]
        hero = (f'<div class="cs-hero"><button data-full="../assets/{f}" data-cap="{escape(strip_tags(cap), quote=True)}">'
                f'<img src="../assets/{f}" alt="{escape(strip_tags(cap), quote=True)}"></button></div>')
    if kind == "project":
        secs = []
        for name, body in item["sections"]:
            body = figs_block(item.get("figs", [])) if body is None else body
            secs.append((name, body))
    else:
        links = "".join(
            f'<a class="btn {"primary" if i == 0 else "ghost"}" href="{u}" target="_blank" rel="noopener">{t}</a>'
            for i, (t, u) in enumerate(item.get("links", [])))
        secs = [("Problem", f"<p>{item['problem']}</p>"),
                ("Methodology", item["method"]),
                ("Result", f'<div class="callout"><p>{item["result"]}</p></div>'),
                ("Technical implementation", item["impl"])]
        if item.get("figs"):
            secs.append(("Gallery", figs_block(item["figs"])))
        if links:
            secs.append(("Try it", f'<div class="tool-links" style="margin-top:0">{links}</div>'))
    secs.append(("Keywords", '<div class="tags">' + "".join(f"<span>{t}</span>" for t in item["tags"]) + "</div>"))
    toc = "".join(f'<a href="#{anchor(n)}">{n}</a>' for n, _ in secs)
    body = "".join(f'<section id="{anchor(n)}"><h2>{n}</h2>{b}</section>' for n, b in secs)
    pager = '<nav class="pager" aria-label="More">'
    pager += (f'<a href="{prev_item["slug"]}.html"><small>← Previous</small>{prev_item["title"]}</a>'
              if prev_item else f'<a href="{back_href}"><small>← Back</small>{back_label}</a>')
    pager += (f'<a class="next" href="{next_item["slug"]}.html"><small>Next →</small>{next_item["title"]}</a>'
              if next_item else f'<a class="next" href="{back_href}"><small>Back →</small>{back_label}</a>')
    pager += "</nav>"
    return (head(strip_tags(item["title"]), strip_tags(item["summary"])) + f"""
<header class="cs-head">
  <div class="wrap">
    <a class="crumb" href="{back_href}">← {back_label}</a>
    <div class="kicker">{item['kicker']}</div>
    <h1>{item['title']}</h1>
    <p class="summary">{item['summary']}</p>
    <dl class="meta">{meta}</dl>
  </div>
</header>
<main>
{hero}
<div class="cs-body">
  <aside class="toc"><b>On this page</b>{toc}</aside>
  <article>{body}</article>
</div>
{pager}
</main>
""" + FOOT)


def build():
    for folder, items, kind, back, label in [
        ("projects", PROJECTS, "project", "../index.html#experience", "All projects"),
        ("tools", TOOLS, "tool", "../index.html#tools", "All tools"),
    ]:
        out = ROOT / folder
        out.mkdir(exist_ok=True)
        for i, it in enumerate(items):
            prev_it = items[i - 1] if i > 0 else None
            next_it = items[i + 1] if i < len(items) - 1 else None
            (out / f"{it['slug']}.html").write_text(page(it, kind, prev_it, next_it, back, label), encoding="utf-8")
        print(folder, len(items))


if __name__ == "__main__":
    build()
