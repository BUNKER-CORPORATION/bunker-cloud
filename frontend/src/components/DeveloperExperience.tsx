import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ChevronRight, Globe, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

const codeSnippet = `> bunker init
Initializing project...
Detected framework: React (Vite)
> bunker deploy --prod
Building project...
Optimizing assets...
Uploading to global edge...
✔ Deployed to https://bunker.app/v9f2a
  Region: Global (35 locations)
  Latency: 35ms`;

export default function DeveloperExperience() {
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState('');

  // Typewriter effect for the terminal
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(codeSnippet.slice(0, i));
      i++;
      if (i > codeSnippet.length) {
        clearInterval(timer);
      }
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const copyCommand = () => {
    navigator.clipboard.writeText('npm install -g bunker-cli');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-white">
      <div className="w-full mx-auto px-16 sm:px-24 md:px-32 lg:px-48 xl:px-64 2xl:px-80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg">
                <Terminal className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-mono font-semibold text-blue-600 tracking-wider uppercase">
                Developer Experience
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Focus on code, <br/>
              <span className="text-gray-400">not configuration.</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Stop wrestling with YAML files and complex pipelines. With Bunker Cloud, you just push your code, and we handle the rest—provisioning, scaling, and security.
            </p>

            <div className="space-y-6 mb-10">
              {[ 
                { icon: Globe, title: "Global by Default", desc: "Apps are automatically deployed to 35+ edge regions." },
                { icon: Zap, title: "Instant Rollbacks", desc: "Mistake in prod? Revert to any version in one click." },
                { icon: Shield, title: "Zero-Trust Security", desc: "Automatic SSL, DDoS protection, and WAF included." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1 bg-gray-50 rounded-lg p-2 h-fit">
                    <item.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <button className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all duration-200 bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                Read the Docs
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
               <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg border border-gray-200">
                  <code className="text-sm font-mono text-gray-600">npm i -g bunker-cli</code>
                  <button 
                    onClick={copyCommand}
                    className="p-1.5 hover:bg-white rounded-md transition-colors ml-2 text-gray-500 hover:text-gray-900"
                    aria-label="Copy command"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
               </div>
            </div>
          </motion.div>

          {/* Right Column: Terminal Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Terminal Window */}
            <div className="relative rounded-xl overflow-hidden bg-[#0d1117] border border-gray-800 shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-gray-800">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="flex-1 text-center">
                  <span className="text-xs font-mono text-gray-500">user@bunker-cloud:~</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 font-mono text-sm md:text-base h-[400px] overflow-y-auto">
                <div className="whitespace-pre-wrap">
                  {text.split('\n').map((line, i) => {
                    if (line.startsWith('>')) {
                      return (
                        <div key={i} className="mb-2 text-white">
                          <span className="text-blue-400 font-bold mr-2">$</span>
                          {line.substring(2)}
                        </div>
                      );
                    }
                    if (line.startsWith('✔')) {
                       return (
                        <div key={i} className="mb-2 text-green-400 font-bold">
                          {line}
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="mb-1 text-gray-400 pl-4">
                        {line}
                      </div>
                    );
                  })}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2.5 h-5 bg-blue-500 align-middle ml-1"
                  />
                </div>
              </div>
              
              {/* Decorative Gradient Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-10 -z-10 transition duration-1000 group-hover:opacity-20"></div>
            </div>

            {/* Floating Cards/Badges - Decorative */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl border border-gray-100 max-w-[200px] hidden md:block"
            >
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-xs font-bold text-gray-600 uppercase">Status</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                Build completed in <span className="text-green-600 font-bold">1.2s</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
