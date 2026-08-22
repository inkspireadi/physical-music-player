import AppKit
import SwiftUI

@main
struct PhysicalMusicPlayerApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    @StateObject private var settings = PlayerSettings()

    var body: some Scene {
        WindowGroup("Physical Music Player", id: "player") {
            PlayerWebView(url: settings.playerURL)
                .frame(width: 463, height: 449)
                .background(WindowConfigurator())
                .environmentObject(settings)
        }
        .defaultSize(width: 463, height: 449)
        .windowResizability(.contentSize)
        .windowStyle(.hiddenTitleBar)
        .commands {
            CommandGroup(replacing: .newItem) { }
            CommandMenu("Player") {
                Button("Close Player") {
                    NSApp.keyWindow?.close()
                }
                .keyboardShortcut("w")

                Button("Reload Player") {
                    NotificationCenter.default.post(name: .reloadPlayer, object: nil)
                }
                .keyboardShortcut("r")
            }
        }

        Settings {
            SettingsView()
                .environmentObject(settings)
        }
    }
}

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    private var statusItem: NSStatusItem?

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)
        installStatusItem()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        false
    }

    private func installStatusItem() {
        let item = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        item.button?.image = NSImage(systemSymbolName: "music.note", accessibilityDescription: "Physical Music Player")

        let menu = NSMenu()
        menu.addItem(withTitle: "Show Player", action: #selector(showPlayer), keyEquivalent: "")
        menu.addItem(withTitle: "Reload Player", action: #selector(reloadPlayer), keyEquivalent: "r")
        menu.addItem(.separator())
        menu.addItem(withTitle: "Quit", action: #selector(quit), keyEquivalent: "q")
        menu.items.forEach { $0.target = self }
        item.menu = menu
        statusItem = item
    }

    @objc private func showPlayer() {
        NSApp.activate(ignoringOtherApps: true)
        if let window = NSApp.windows.first(where: { $0.canBecomeMain }) {
            window.makeKeyAndOrderFront(nil)
        }
    }

    @objc private func reloadPlayer() {
        showPlayer()
        NotificationCenter.default.post(name: .reloadPlayer, object: nil)
    }

    @objc private func quit() {
        NSApp.terminate(nil)
    }
}

extension Notification.Name {
    static let reloadPlayer = Notification.Name("PhysicalMusicPlayer.reload")
}
