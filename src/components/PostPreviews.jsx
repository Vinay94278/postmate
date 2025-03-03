// src/components/PostPreviews.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseAgentContent } from '@/utils/parseAgentContent';

export const LinkedInPreview = ({ post, username = 'Your Name' }) => {
  // Format the username for display
  const displayName = username || 'Your Name';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header with profile info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#0077b5] rounded-full mr-3 flex items-center justify-center text-white font-bold">
            {initial}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-gray-600 text-sm">Founder & AI Enthusiast • 1st</p>
            <div className="flex items-center gap-1">
              <span className="text-xs font-normal text-gray-500">Just now</span>
              <span className="text-xs font-normal text-gray-500">•</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-gray-500">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="p-4 font-sans text-gray-900">
        <div className="prose prose-li:my-0 prose-ul:my-0 prose-p:my-2 max-w-none linkedin-prose whitespace-pre-wrap">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              strong: ({ node, ...props }) => <span className="font-semibold" {...props} />,
              em: ({ node, ...props }) => <span className="italic" {...props} />,
              a: ({ node, ...props }) => <a className="text-[#0077b5] hover:underline" {...props} />
            }}
          >
            {parseAgentContent(post || 'No content generated yet.')}
          </ReactMarkdown>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Engagement metrics */}
      <div className="py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <div className="flex -space-x-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white">👍</div>
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs border-2 border-white">❤️</div>
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs border-2 border-white">👏</div>
            </div>
            <span className="text-xs text-gray-500 font-medium">You and 88 others</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="font-medium text-gray-500 text-xs">4 comments</span>
            <span className="font-medium text-gray-500 text-xs">•</span>
            <span className="font-medium text-gray-500 text-xs">1 repost</span>
          </div>
        </div>

        {/* Action buttons */}
        <hr className="my-3 border-gray-200" />
        <div className="flex items-center justify-around">
          <button className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 26 26" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22.75 10.563h-4.874v10.562h4.875a.812.812 0 0 0 .812-.813v-8.937a.812.812 0 0 0-.812-.813v0Z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m17.876 10.563-4.063-8.126a3.25 3.25 0 0 0-3.25 3.25v2.438H4.28a1.625 1.625 0 0 0-1.613 1.827l1.22 9.75a1.625 1.625 0 0 0 1.612 1.423h12.378"></path>
            </svg>
            Like
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 26 26" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.28 17.976a9.746 9.746 0 1 1 3.41 3.41h0l-3.367.962a.813.813 0 0 1-1.005-1.004l.963-3.368h0ZM10.417 11.375h6.5M10.417 14.625h6.5"></path>
            </svg>
            Comment
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 26 26" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m18.208 15.438 4.875-4.876-4.875-4.874"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.583 20.313a9.75 9.75 0 0 1 9.75-9.75h9.75"></path>
            </svg>
            Share
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 px-1.5 rounded-lg text-gray-500 hover:bg-gray-100 text-sm font-semibold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 26 26" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.354 3.644 2.43 8.98a.812.812 0 0 0-.128 1.517l8.695 4.118c.17.08.306.217.387.387l4.118 8.695a.812.812 0 0 0 1.517-.128l5.337-18.924a.813.813 0 0 0-1.002-1.002ZM11.26 14.74l4.596-4.596"></path>
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export const XPreview = ({ post, username = 'Your Name' }) => {
  // Format the username for display
  const displayName = username || 'Your Name';
  const handle = username ? `@${username.replace('@', '')}` : '@username';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-black rounded-2xl shadow-xl border border-gray-800 overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Header with profile info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-800 rounded-full mr-3 flex items-center justify-center text-white border border-gray-700">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-white">{displayName}</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">{handle}</p>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="p-4 font-sans text-white">
        <div className="prose prose-invert prose-li:my-0 prose-ul:my-0 prose-p:my-2 max-w-none twitter-prose whitespace-pre-wrap">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              text:({ node, ...props }) => <text className=" text-white" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
              small: ({ node, ...props }) => <small className="font-small text-white" {...props} />,
              i: ({ node, ...props }) => <i className="font-italic text-white" {...props} />,
              em: ({ node, ...props }) => <em className="italic text-gray-200" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" {...props} />,
              p: ({ node, ...props }) => <p className="mb-3 leading-snug text-white" {...props} />
            }}
          >
            {parseAgentContent(post || 'No content generated yet.')}
          </ReactMarkdown>
        </div>

        {/* Rest of the component remains the same */}
        <p className="mt-2 text-gray-500 text-sm border-b border-gray-800 pb-3">
          8:30 PM · Mar 2, 2025 · <span className="text-blue-400">Postmate</span>
        </p>

        {/* Engagement metrics */}
        <div className="mt-3 grid grid-cols-4 text-gray-400 text-sm">
          <div className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
            </svg>
            <span>89.2K</span>
          </div>
          <div className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 01.75.75v16.5h16.5a.75.75 0 010 1.5h-17.25a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10.5 6.75a.75.75 0 01.75-.75h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-10.5a.75.75 0 01-.75-.75V6.75zm2.25 6a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0z" clipRule="evenodd" />
            </svg>
            <span>1.2K</span>
          </div>
          <div className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span>4.8K</span>
          </div>
          <div className="flex items-center gap-1 hover:text-blue-400 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
            </svg>
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};