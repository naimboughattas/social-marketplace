import { ArrowRight, Heart, MessageCircle, UserPlus } from 'lucide-react';
import Button from './Button';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative isolate pt-14">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-600 to-pink-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Boost Your Instagram Presence with Real Interactions
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with authentic influencers for genuine engagement. Get real follows, likes, and comments from active Instagram users.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/signup">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                How it works
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 flow-root sm:mt-24">
          <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-lg bg-white shadow-xl ring-1 ring-gray-900/5">
              <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Real Follows</h3>
                  <p className="mt-2 text-gray-600">Connect with active Instagram users who match your target audience</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Genuine Likes</h3>
                  <p className="mt-2 text-gray-600">Get authentic engagement from real people who appreciate your content</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Meaningful Comments</h3>
                  <p className="mt-2 text-gray-600">Receive thoughtful comments that spark genuine conversations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}