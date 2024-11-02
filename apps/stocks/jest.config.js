module.exports = {
  name: 'stocks',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/stocks/',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
