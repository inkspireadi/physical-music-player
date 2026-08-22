import SwiftUI
import WebKit

struct PlayerWebView: NSViewRepresentable {
    let url: URL

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeNSView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.allowsAirPlayForMediaPlayback = false

        let widgetCSS = """
        (() => {
          const style = document.createElement('style');
          style.textContent = `
            html, body { background: transparent !important; overflow: hidden !important; }
            main { min-height: 100vh !important; padding: 16px !important; }
          `;
          document.documentElement.appendChild(style);
        })();
        """
        configuration.userContentController.addUserScript(
            WKUserScript(source: widgetCSS, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        )

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.allowsMagnification = false
        webView.wantsLayer = true
        webView.layer?.backgroundColor = NSColor.clear.cgColor
        if #available(macOS 13.3, *) {
            webView.isInspectable = true
        }

        context.coordinator.webView = webView
        context.coordinator.load(url: url)
        context.coordinator.reloadObserver = NotificationCenter.default.addObserver(
            forName: .reloadPlayer,
            object: nil,
            queue: .main
        ) { [weak webView] _ in
            Task { @MainActor in
                webView?.reload()
            }
        }
        return webView
    }

    func updateNSView(_ webView: WKWebView, context: Context) {
        guard context.coordinator.requestedURL != url else { return }
        context.coordinator.load(url: url)
    }

    static func dismantleNSView(_ webView: WKWebView, coordinator: Coordinator) {
        if let observer = coordinator.reloadObserver {
            NotificationCenter.default.removeObserver(observer)
        }
        webView.stopLoading()
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        weak var webView: WKWebView?
        var requestedURL: URL?
        var reloadObserver: NSObjectProtocol?

        func load(url: URL) {
            requestedURL = url
            webView?.load(URLRequest(url: url, cachePolicy: .reloadRevalidatingCacheData))
        }
    }
}
