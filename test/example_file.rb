require 'minitest/autorun'

class Bowling

  def score(frames)
    frames.each_with_index.inject(0) do |sum, (this_frame, idx)| 
        next_two_balls = frames.fetch(idx+1, [0]).concat([0,0]).concat([0,0]).first(2)
        bonus = calculate_bonus(this_frame, next_two_balls, idx)
        sum + sum_frame(this_frame) + bonus
    end
  end

  def calculate_bonus(this_frame, next_frame, idx)
    if this_frame[0] == 10
        return sum_frame(next_frame.first(2)) 
    end 
    if sum_frame(this_frame) == 10
        return next_frame[0]
    end
    0
  end

  def sum_frame(frame)
    frame.inject(0){|sum, x| sum + x }
  end
end

class BlehTest < Minitest::Test 
  def test_gutter_ball_run
    assert 0 == Bowling.new.score(
        [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]]
    )
  end

  def test_threes
    assert 9 == Bowling.new.score([[3, 3], [3, 0]])
  end

  def test_spares
    assert 20 == Bowling.new.score([[0, 10], [5, 0]])
    assert 22 == Bowling.new.score([[1, 9], [6, 0]])
  end

  def test_last_frame_when_previous_was_a_spare
    assert 140 == Bowling.new.score(
        [[4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6], [4,6,4]]
    )
  end

  def test_strike
    assert 22 == Bowling.new.score([[10], [5, 1]])
    #assert 46 == Bowling.new.score([[10], [10], [3,3]])
  end

  def test_perfect_game
    # assert 240 == Bowling.new.score([[10], [10], [10], [10], [10], [10], [10], [10], [10], [0,0])
  end
end