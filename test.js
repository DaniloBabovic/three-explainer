const a = require ("./dist/explainer.cjs.development.js")

console.log ( a )

const example = () => {
  // 3D Explainer APi
  const exp = useExplainer("three_container");
  exp.add.axis.setOrigin(Origin.CENTER);
  // Axis X Options
  const axisOptX = {
    from: -5,
    to: 5,
    period: 1,
    periodSize: 8,
    color: "#888888",
    thickness: 2,
    fontSize: 4,
  };
  exp.add.axis.addXAxis(axisOptX);
  // Axis Y Options
  const axisOptY = {
    from: -5,
    to: 5,
    period: 1,
    periodSize: 8,
    color: "#448888",
    thickness: 2,
    fontSize: 4,
  };
  exp.add.axis.addYAxis(axisOptY);
  exp.add.axis.create();

  exp.add.insert();
  exp.stage.render();
};

example();
