Pod::Spec.new do |s|
  s.name           = 'RvLidar'
  s.version        = '0.1.0'
  s.summary        = 'RV LiDAR availability module'
  s.description    = 'Checks ARKit depth/LiDAR availability for RV Assist.'
  s.author         = 'Gerhard Crous'
  s.homepage       = 'https://example.com'
  s.platforms      = { :ios => '15.1' }
  s.source         = { :path => '.' }
  s.static_framework = true
  s.swift_version  = '5.9'

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,mm,swift}'
end
