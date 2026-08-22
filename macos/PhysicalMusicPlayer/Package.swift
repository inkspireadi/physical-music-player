// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "PhysicalMusicPlayer",
    platforms: [.macOS(.v14)],
    products: [
        .executable(name: "PhysicalMusicPlayer", targets: ["PhysicalMusicPlayer"]),
    ],
    targets: [
        .executableTarget(
            name: "PhysicalMusicPlayer",
            path: "Sources/PhysicalMusicPlayer"
        ),
    ]
)
