import VimQuest from './VimQuest'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Banner Ad - 728x90 Leaderboard */}
      <div className="bg-gray-800 flex items-center justify-center p-4 border-b border-gray-700">
        <div className="w-[728px] h-[90px] bg-gray-700 flex items-center justify-center text-gray-500 text-sm">
          {/* Ad Placeholder - Replace with AdSense code */}
          {/* 
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '728px', height: '90px' }}
               data-ad-client="ca-pub-XXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"></ins>
          */}
          Ad Space (728x90)
        </div>
      </div>

      {/* Main Game */}
      <VimQuest />

      {/* Footer with smaller ad option */}
      <div className="bg-gray-800 flex items-center justify-center p-4 border-t border-gray-700 mt-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">
            Made with ❤️ for Vim enthusiasts | <a href="https://github.com/yourusername/vimquest" className="text-green-400 hover:text-green-300">GitHub</a>
          </p>
          {/* Optional footer ad - 468x60 Banner */}
          {/* 
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '468px', height: '60px' }}
               data-ad-client="ca-pub-XXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"></ins>
          */}
        </div>
      </div>
    </div>
  )
}

export default App
