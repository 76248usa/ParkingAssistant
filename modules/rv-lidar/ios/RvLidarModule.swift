import ExpoModulesCore
import ARKit
import UIKit

public class RvLidarModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RvLidar")

    Function("checkAvailability") { () -> [String: Any] in
      let deviceName = UIDevice.current.model
      let systemVersion = UIDevice.current.systemVersion

      let worldTrackingSupported = ARWorldTrackingConfiguration.isSupported

      var sceneDepthSupported = false
      var smoothedSceneDepthSupported = false
      var sceneReconstructionSupported = false

      if worldTrackingSupported {
        if #available(iOS 13.4, *) {
          sceneDepthSupported = ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth)
          smoothedSceneDepthSupported = ARWorldTrackingConfiguration.supportsFrameSemantics(.smoothedSceneDepth)
          sceneReconstructionSupported = ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh)
        }
      }

      let lidarLikelySupported =
        worldTrackingSupported &&
        (sceneDepthSupported || smoothedSceneDepthSupported || sceneReconstructionSupported)

      let status = lidarLikelySupported ? "supported" : "not-supported"

      let message = lidarLikelySupported
        ? "This device supports ARKit depth features needed for Real LiDAR Assist."
        : "This device does not report ARKit LiDAR/depth support. Manual and Test LiDAR modes are still available."

      return [
        "status": status,
        "deviceName": deviceName,
        "systemVersion": systemVersion,
        "worldTrackingSupported": worldTrackingSupported,
        "sceneDepthSupported": sceneDepthSupported,
        "smoothedSceneDepthSupported": smoothedSceneDepthSupported,
        "sceneReconstructionSupported": sceneReconstructionSupported,
        "lidarLikelySupported": lidarLikelySupported,
        "message": message
      ]
    }
  }
}
