import Foundation
import SwiftUI

@MainActor
final class PlayerSettings: ObservableObject {
    private static let key = "playerURL"
    private static let fallback = "http://localhost:3000/"

    @Published var urlText: String

    init() {
        urlText = UserDefaults.standard.string(forKey: Self.key)
            ?? ProcessInfo.processInfo.environment["PHYSICAL_PLAYER_URL"]
            ?? Self.fallback
    }

    var playerURL: URL {
        URL(string: urlText.trimmingCharacters(in: .whitespacesAndNewlines))
            ?? URL(string: Self.fallback)!
    }

    func save() {
        guard let url = URL(string: urlText), ["http", "https"].contains(url.scheme?.lowercased()) else {
            urlText = Self.fallback
            return
        }
        UserDefaults.standard.set(url.absoluteString, forKey: Self.key)
        NotificationCenter.default.post(name: .reloadPlayer, object: nil)
    }

    func reset() {
        urlText = Self.fallback
        save()
    }
}

struct SettingsView: View {
    @EnvironmentObject private var settings: PlayerSettings

    var body: some View {
        Form {
            TextField("Player URL", text: $settings.urlText)
                .textFieldStyle(.roundedBorder)
            HStack {
                Button("Use Localhost") { settings.reset() }
                Spacer()
                Button("Save") { settings.save() }
                    .keyboardShortcut(.defaultAction)
            }
            Text("Use http://localhost:3000 while developing, then replace it with the public HTTPS URL after deployment.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding(20)
        .frame(width: 440)
    }
}
